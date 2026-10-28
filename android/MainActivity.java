package com.adnsalvaje.game;
import android.app.Activity;
import android.os.Bundle;
import android.webkit.*;
import android.content.*;
import android.net.Uri;
import android.os.Build;
import android.provider.MediaStore;
import android.os.Environment;
import android.widget.Toast;
import java.io.OutputStream;
public class MainActivity extends Activity {
 private WebView web; private ValueCallback<Uri[]> chooser;
 @Override public void onCreate(Bundle b){super.onCreate(b);getWindow().setStatusBarColor(0xff101e27);getWindow().setNavigationBarColor(0xff13232d);web=new WebView(this);web.setBackgroundColor(0xff101e27);setContentView(web);web.setOnApplyWindowInsetsListener((v,insets)->{v.setPadding(insets.getSystemWindowInsetLeft(),insets.getSystemWindowInsetTop(),insets.getSystemWindowInsetRight(),insets.getSystemWindowInsetBottom());return insets;});WebSettings s=web.getSettings();s.setJavaScriptEnabled(true);s.setDomStorageEnabled(true);s.setAllowFileAccess(true);s.setAllowContentAccess(true);s.setAllowFileAccessFromFileURLs(false);s.setAllowUniversalAccessFromFileURLs(false);s.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);web.addJavascriptInterface(new SaveBridge(),"Android");web.setWebViewClient(new WebViewClient(){@Override public boolean shouldOverrideUrlLoading(WebView v,WebResourceRequest r){return !r.getUrl().toString().startsWith("file:///android_asset/");}});web.setWebChromeClient(new WebChromeClient(){@Override public boolean onShowFileChooser(WebView v,ValueCallback<Uri[]> cb,FileChooserParams p){if(chooser!=null)chooser.onReceiveValue(null);chooser=cb;Intent i=new Intent(Intent.ACTION_OPEN_DOCUMENT);i.setType("application/json");i.addCategory(Intent.CATEGORY_OPENABLE);try{startActivityForResult(i,9);}catch(Exception e){chooser.onReceiveValue(null);chooser=null;return false;}return true;}});web.loadUrl("file:///android_asset/index.html");}
 @Override protected void onActivityResult(int r,int c,Intent d){super.onActivityResult(r,c,d);if(r==9&&chooser!=null){chooser.onReceiveValue(c==RESULT_OK&&d!=null?new Uri[]{d.getData()}:null);chooser=null;}}
 public class SaveBridge {@JavascriptInterface public boolean exportSave(String data){if(data.length()>5000000)return false;try{if(Build.VERSION.SDK_INT>=29){ContentValues v=new ContentValues();v.put(MediaStore.Downloads.DISPLAY_NAME,"adn-salvaje-"+System.currentTimeMillis()+".json");v.put(MediaStore.Downloads.MIME_TYPE,"application/json");v.put(MediaStore.Downloads.IS_PENDING,1);Uri u=getContentResolver().insert(MediaStore.Downloads.EXTERNAL_CONTENT_URI,v);try(OutputStream out=getContentResolver().openOutputStream(u)){out.write(data.getBytes("UTF-8"));}v.clear();v.put(MediaStore.Downloads.IS_PENDING,0);getContentResolver().update(u,v,null,null);}else{java.io.File f=new java.io.File(getExternalFilesDir(Environment.DIRECTORY_DOWNLOADS),"adn-salvaje-partida.json");try(OutputStream out=new java.io.FileOutputStream(f)){out.write(data.getBytes("UTF-8"));}runOnUiThread(()->Toast.makeText(MainActivity.this,"Copia guardada en la carpeta de la aplicación",Toast.LENGTH_LONG).show());}return true;}catch(Exception e){runOnUiThread(()->Toast.makeText(MainActivity.this,"No se pudo exportar la partida",Toast.LENGTH_LONG).show());return false;}}}
 @Override public void onBackPressed(){web.evaluateJavascript("if(!battle){close();go('explore');}else{toast('Termina el encuentro o usa Retirarse.');}",null);}
 @Override protected void onPause(){super.onPause();web.onPause();} @Override protected void onResume(){super.onResume();if(web!=null)web.onResume();}
}
