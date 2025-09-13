.class Lio/ionic/keyboard/IonicKeyboard$3;
.super Ljava/lang/Object;
.source "IonicKeyboard.java"

# interfaces
.implements Ljava/lang/Runnable;


# annotations
.annotation system Ldalvik/annotation/EnclosingMethod;
    value = Lio/ionic/keyboard/IonicKeyboard;->execute(Ljava/lang/String;Lorg/json/JSONArray;Lorg/apache/cordova/CallbackContext;)Z
.end annotation

.annotation system Ldalvik/annotation/InnerClass;
    accessFlags = 0x0
    name = null
.end annotation


# instance fields
.field final synthetic this$0:Lio/ionic/keyboard/IonicKeyboard;

.field final synthetic val$callbackContext:Lorg/apache/cordova/CallbackContext;


# direct methods
.method constructor <init>(Lio/ionic/keyboard/IonicKeyboard;Lorg/apache/cordova/CallbackContext;)V
    .locals 0
    .param p1, "this$0"    # Lio/ionic/keyboard/IonicKeyboard;

    .prologue
    .line 58
    iput-object p1, p0, Lio/ionic/keyboard/IonicKeyboard$3;->this$0:Lio/ionic/keyboard/IonicKeyboard;

    iput-object p2, p0, Lio/ionic/keyboard/IonicKeyboard$3;->val$callbackContext:Lorg/apache/cordova/CallbackContext;

    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    return-void
.end method


# virtual methods
.method public run()V
    .locals 7

    .prologue
    .line 62
    new-instance v2, Landroid/util/DisplayMetrics;

    invoke-direct {v2}, Landroid/util/DisplayMetrics;-><init>()V

    .line 63
    .local v2, "dm":Landroid/util/DisplayMetrics;
    iget-object v5, p0, Lio/ionic/keyboard/IonicKeyboard$3;->this$0:Lio/ionic/keyboard/IonicKeyboard;

    iget-object v5, v5, Lio/ionic/keyboard/IonicKeyboard;->cordova:Lorg/apache/cordova/CordovaInterface;

    invoke-interface {v5}, Lorg/apache/cordova/CordovaInterface;->getActivity()Landroid/app/Activity;

    move-result-object v5

    invoke-virtual {v5}, Landroid/app/Activity;->getWindowManager()Landroid/view/WindowManager;

    move-result-object v5

    invoke-interface {v5}, Landroid/view/WindowManager;->getDefaultDisplay()Landroid/view/Display;

    move-result-object v5

    invoke-virtual {v5, v2}, Landroid/view/Display;->getMetrics(Landroid/util/DisplayMetrics;)V

    .line 64
    iget v1, v2, Landroid/util/DisplayMetrics;->density:F

    .line 67
    .local v1, "density":F
    iget-object v5, p0, Lio/ionic/keyboard/IonicKeyboard$3;->this$0:Lio/ionic/keyboard/IonicKeyboard;

    iget-object v5, v5, Lio/ionic/keyboard/IonicKeyboard;->cordova:Lorg/apache/cordova/CordovaInterface;

    invoke-interface {v5}, Lorg/apache/cordova/CordovaInterface;->getActivity()Landroid/app/Activity;

    move-result-object v5

    invoke-virtual {v5}, Landroid/app/Activity;->getWindow()Landroid/view/Window;

    move-result-object v5

    invoke-virtual {v5}, Landroid/view/Window;->getDecorView()Landroid/view/View;

    move-result-object v5

    const v6, 0x1020002

    invoke-virtual {v5, v6}, Landroid/view/View;->findViewById(I)Landroid/view/View;

    move-result-object v5

    invoke-virtual {v5}, Landroid/view/View;->getRootView()Landroid/view/View;

    move-result-object v4

    .line 68
    .local v4, "rootView":Landroid/view/View;
    new-instance v3, Lio/ionic/keyboard/IonicKeyboard$3$1;

    invoke-direct {v3, p0, v4, v1}, Lio/ionic/keyboard/IonicKeyboard$3$1;-><init>(Lio/ionic/keyboard/IonicKeyboard$3;Landroid/view/View;F)V

    .line 114
    .local v3, "list":Landroid/view/ViewTreeObserver$OnGlobalLayoutListener;
    invoke-virtual {v4}, Landroid/view/View;->getViewTreeObserver()Landroid/view/ViewTreeObserver;

    move-result-object v5

    invoke-virtual {v5, v3}, Landroid/view/ViewTreeObserver;->addOnGlobalLayoutListener(Landroid/view/ViewTreeObserver$OnGlobalLayoutListener;)V

    .line 117
    new-instance v0, Lorg/apache/cordova/PluginResult;

    sget-object v5, Lorg/apache/cordova/PluginResult$Status;->OK:Lorg/apache/cordova/PluginResult$Status;

    invoke-direct {v0, v5}, Lorg/apache/cordova/PluginResult;-><init>(Lorg/apache/cordova/PluginResult$Status;)V

    .line 118
    .local v0, "dataResult":Lorg/apache/cordova/PluginResult;
    const/4 v5, 0x1

    invoke-virtual {v0, v5}, Lorg/apache/cordova/PluginResult;->setKeepCallback(Z)V

    .line 119
    iget-object v5, p0, Lio/ionic/keyboard/IonicKeyboard$3;->val$callbackContext:Lorg/apache/cordova/CallbackContext;

    invoke-virtual {v5, v0}, Lorg/apache/cordova/CallbackContext;->sendPluginResult(Lorg/apache/cordova/PluginResult;)V

    .line 120
    return-void
.end method
