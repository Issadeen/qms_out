.class public Lio/ionic/keyboard/IonicKeyboard;
.super Lorg/apache/cordova/CordovaPlugin;
.source "IonicKeyboard.java"


# direct methods
.method public constructor <init>()V
    .locals 0

    .prologue
    .line 24
    invoke-direct {p0}, Lorg/apache/cordova/CordovaPlugin;-><init>()V

    return-void
.end method


# virtual methods
.method public execute(Ljava/lang/String;Lorg/json/JSONArray;Lorg/apache/cordova/CallbackContext;)Z
    .locals 3
    .param p1, "action"    # Ljava/lang/String;
    .param p2, "args"    # Lorg/json/JSONArray;
    .param p3, "callbackContext"    # Lorg/apache/cordova/CallbackContext;
    .annotation system Ldalvik/annotation/Throws;
        value = {
            Lorg/json/JSONException;
        }
    .end annotation

    .prologue
    const/4 v0, 0x1

    .line 31
    const-string v1, "close"

    invoke-virtual {v1, p1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v1

    if-eqz v1, :cond_0

    .line 32
    iget-object v1, p0, Lio/ionic/keyboard/IonicKeyboard;->cordova:Lorg/apache/cordova/CordovaInterface;

    invoke-interface {v1}, Lorg/apache/cordova/CordovaInterface;->getThreadPool()Ljava/util/concurrent/ExecutorService;

    move-result-object v1

    new-instance v2, Lio/ionic/keyboard/IonicKeyboard$1;

    invoke-direct {v2, p0, p3}, Lio/ionic/keyboard/IonicKeyboard$1;-><init>(Lio/ionic/keyboard/IonicKeyboard;Lorg/apache/cordova/CallbackContext;)V

    invoke-interface {v1, v2}, Ljava/util/concurrent/ExecutorService;->execute(Ljava/lang/Runnable;)V

    .line 124
    :goto_0
    return v0

    .line 48
    :cond_0
    const-string v1, "show"

    invoke-virtual {v1, p1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v1

    if-eqz v1, :cond_1

    .line 49
    iget-object v1, p0, Lio/ionic/keyboard/IonicKeyboard;->cordova:Lorg/apache/cordova/CordovaInterface;

    invoke-interface {v1}, Lorg/apache/cordova/CordovaInterface;->getThreadPool()Ljava/util/concurrent/ExecutorService;

    move-result-object v1

    new-instance v2, Lio/ionic/keyboard/IonicKeyboard$2;

    invoke-direct {v2, p0, p3}, Lio/ionic/keyboard/IonicKeyboard$2;-><init>(Lio/ionic/keyboard/IonicKeyboard;Lorg/apache/cordova/CallbackContext;)V

    invoke-interface {v1, v2}, Ljava/util/concurrent/ExecutorService;->execute(Ljava/lang/Runnable;)V

    goto :goto_0

    .line 57
    :cond_1
    const-string v1, "init"

    invoke-virtual {v1, p1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v1

    if-eqz v1, :cond_2

    .line 58
    iget-object v1, p0, Lio/ionic/keyboard/IonicKeyboard;->cordova:Lorg/apache/cordova/CordovaInterface;

    invoke-interface {v1}, Lorg/apache/cordova/CordovaInterface;->getThreadPool()Ljava/util/concurrent/ExecutorService;

    move-result-object v1

    new-instance v2, Lio/ionic/keyboard/IonicKeyboard$3;

    invoke-direct {v2, p0, p3}, Lio/ionic/keyboard/IonicKeyboard$3;-><init>(Lio/ionic/keyboard/IonicKeyboard;Lorg/apache/cordova/CallbackContext;)V

    invoke-interface {v1, v2}, Ljava/util/concurrent/ExecutorService;->execute(Ljava/lang/Runnable;)V

    goto :goto_0

    .line 124
    :cond_2
    const/4 v0, 0x0

    goto :goto_0
.end method

.method public initialize(Lorg/apache/cordova/CordovaInterface;Lorg/apache/cordova/CordovaWebView;)V
    .locals 0
    .param p1, "cordova"    # Lorg/apache/cordova/CordovaInterface;
    .param p2, "webView"    # Lorg/apache/cordova/CordovaWebView;

    .prologue
    .line 27
    invoke-super {p0, p1, p2}, Lorg/apache/cordova/CordovaPlugin;->initialize(Lorg/apache/cordova/CordovaInterface;Lorg/apache/cordova/CordovaWebView;)V

    .line 28
    return-void
.end method
