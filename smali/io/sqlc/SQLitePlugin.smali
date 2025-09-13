.class public Lio/sqlc/SQLitePlugin;
.super Lorg/apache/cordova/CordovaPlugin;
.source "SQLitePlugin.java"


# annotations
.annotation system Ldalvik/annotation/MemberClasses;
    value = {
        Lio/sqlc/SQLitePlugin$Action;,
        Lio/sqlc/SQLitePlugin$DBQuery;,
        Lio/sqlc/SQLitePlugin$DBRunner;
    }
.end annotation


# static fields
.field static dbrmap:Ljava/util/Map;
    .annotation system Ldalvik/annotation/Signature;
        value = {
            "Ljava/util/Map",
            "<",
            "Ljava/lang/String;",
            "Lio/sqlc/SQLitePlugin$DBRunner;",
            ">;"
        }
    .end annotation
.end field


# direct methods
.method static constructor <clinit>()V
    .locals 1

    .prologue
    .line 47
    new-instance v0, Ljava/util/concurrent/ConcurrentHashMap;

    invoke-direct {v0}, Ljava/util/concurrent/ConcurrentHashMap;-><init>()V

    sput-object v0, Lio/sqlc/SQLitePlugin;->dbrmap:Ljava/util/Map;

    return-void
.end method

.method public constructor <init>()V
    .locals 0

    .prologue
    .line 30
    invoke-direct {p0}, Lorg/apache/cordova/CordovaPlugin;-><init>()V

    return-void
.end method

.method static synthetic access$000(Lio/sqlc/SQLitePlugin;Ljava/lang/String;Lorg/apache/cordova/CallbackContext;Z)Lio/sqlc/SQLiteAndroidDatabase;
    .locals 1
    .param p0, "x0"    # Lio/sqlc/SQLitePlugin;
    .param p1, "x1"    # Ljava/lang/String;
    .param p2, "x2"    # Lorg/apache/cordova/CallbackContext;
    .param p3, "x3"    # Z
    .annotation system Ldalvik/annotation/Throws;
        value = {
            Ljava/lang/Exception;
        }
    .end annotation

    .prologue
    .line 30
    invoke-direct {p0, p1, p2, p3}, Lio/sqlc/SQLitePlugin;->openDatabase(Ljava/lang/String;Lorg/apache/cordova/CallbackContext;Z)Lio/sqlc/SQLiteAndroidDatabase;

    move-result-object v0

    return-object v0
.end method

.method static synthetic access$100(Lio/sqlc/SQLitePlugin;Ljava/lang/String;)V
    .locals 0
    .param p0, "x0"    # Lio/sqlc/SQLitePlugin;
    .param p1, "x1"    # Ljava/lang/String;

    .prologue
    .line 30
    invoke-direct {p0, p1}, Lio/sqlc/SQLitePlugin;->closeDatabaseNow(Ljava/lang/String;)V

    return-void
.end method

.method static synthetic access$200(Lio/sqlc/SQLitePlugin;Ljava/lang/String;)Z
    .locals 1
    .param p0, "x0"    # Lio/sqlc/SQLitePlugin;
    .param p1, "x1"    # Ljava/lang/String;

    .prologue
    .line 30
    invoke-direct {p0, p1}, Lio/sqlc/SQLitePlugin;->deleteDatabaseNow(Ljava/lang/String;)Z

    move-result v0

    return v0
.end method

.method private closeDatabase(Ljava/lang/String;Lorg/apache/cordova/CallbackContext;)V
    .locals 5
    .param p1, "dbname"    # Ljava/lang/String;
    .param p2, "cbc"    # Lorg/apache/cordova/CallbackContext;

    .prologue
    .line 234
    sget-object v2, Lio/sqlc/SQLitePlugin;->dbrmap:Ljava/util/Map;

    invoke-interface {v2, p1}, Ljava/util/Map;->get(Ljava/lang/Object;)Ljava/lang/Object;

    move-result-object v1

    check-cast v1, Lio/sqlc/SQLitePlugin$DBRunner;

    .line 235
    .local v1, "r":Lio/sqlc/SQLitePlugin$DBRunner;
    if-eqz v1, :cond_2

    .line 237
    :try_start_0
    iget-object v2, v1, Lio/sqlc/SQLitePlugin$DBRunner;->q:Ljava/util/concurrent/BlockingQueue;

    new-instance v3, Lio/sqlc/SQLitePlugin$DBQuery;

    const/4 v4, 0x0

    invoke-direct {v3, p0, v4, p2}, Lio/sqlc/SQLitePlugin$DBQuery;-><init>(Lio/sqlc/SQLitePlugin;ZLorg/apache/cordova/CallbackContext;)V

    invoke-interface {v2, v3}, Ljava/util/concurrent/BlockingQueue;->put(Ljava/lang/Object;)V
    :try_end_0
    .catch Ljava/lang/Exception; {:try_start_0 .. :try_end_0} :catch_0

    .line 249
    :cond_0
    :goto_0
    return-void

    .line 238
    :catch_0
    move-exception v0

    .line 239
    .local v0, "e":Ljava/lang/Exception;
    if-eqz p2, :cond_1

    .line 240
    new-instance v2, Ljava/lang/StringBuilder;

    invoke-direct {v2}, Ljava/lang/StringBuilder;-><init>()V

    const-string v3, "couldn\'t close database"

    invoke-virtual {v2, v3}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v2

    invoke-virtual {v2, v0}, Ljava/lang/StringBuilder;->append(Ljava/lang/Object;)Ljava/lang/StringBuilder;

    move-result-object v2

    invoke-virtual {v2}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v2

    invoke-virtual {p2, v2}, Lorg/apache/cordova/CallbackContext;->error(Ljava/lang/String;)V

    .line 242
    :cond_1
    const-class v2, Lio/sqlc/SQLitePlugin;

    invoke-virtual {v2}, Ljava/lang/Class;->getSimpleName()Ljava/lang/String;

    move-result-object v2

    const-string v3, "couldn\'t close database"

    invoke-static {v2, v3, v0}, Landroid/util/Log;->e(Ljava/lang/String;Ljava/lang/String;Ljava/lang/Throwable;)I

    goto :goto_0

    .line 245
    .end local v0    # "e":Ljava/lang/Exception;
    :cond_2
    if-eqz p2, :cond_0

    .line 246
    invoke-virtual {p2}, Lorg/apache/cordova/CallbackContext;->success()V

    goto :goto_0
.end method

.method private closeDatabaseNow(Ljava/lang/String;)V
    .locals 3
    .param p1, "dbname"    # Ljava/lang/String;

    .prologue
    .line 257
    sget-object v2, Lio/sqlc/SQLitePlugin;->dbrmap:Ljava/util/Map;

    invoke-interface {v2, p1}, Ljava/util/Map;->get(Ljava/lang/Object;)Ljava/lang/Object;

    move-result-object v1

    check-cast v1, Lio/sqlc/SQLitePlugin$DBRunner;

    .line 259
    .local v1, "r":Lio/sqlc/SQLitePlugin$DBRunner;
    if-eqz v1, :cond_0

    .line 260
    iget-object v0, v1, Lio/sqlc/SQLitePlugin$DBRunner;->mydb:Lio/sqlc/SQLiteAndroidDatabase;

    .line 262
    .local v0, "mydb":Lio/sqlc/SQLiteAndroidDatabase;
    if-eqz v0, :cond_0

    .line 263
    invoke-virtual {v0}, Lio/sqlc/SQLiteAndroidDatabase;->closeDatabaseNow()V

    .line 265
    .end local v0    # "mydb":Lio/sqlc/SQLiteAndroidDatabase;
    :cond_0
    return-void
.end method

.method private deleteDatabase(Ljava/lang/String;Lorg/apache/cordova/CallbackContext;)V
    .locals 6
    .param p1, "dbname"    # Ljava/lang/String;
    .param p2, "cbc"    # Lorg/apache/cordova/CallbackContext;

    .prologue
    .line 268
    sget-object v3, Lio/sqlc/SQLitePlugin;->dbrmap:Ljava/util/Map;

    invoke-interface {v3, p1}, Ljava/util/Map;->get(Ljava/lang/Object;)Ljava/lang/Object;

    move-result-object v2

    check-cast v2, Lio/sqlc/SQLitePlugin$DBRunner;

    .line 269
    .local v2, "r":Lio/sqlc/SQLitePlugin$DBRunner;
    if-eqz v2, :cond_1

    .line 271
    :try_start_0
    iget-object v3, v2, Lio/sqlc/SQLitePlugin$DBRunner;->q:Ljava/util/concurrent/BlockingQueue;

    new-instance v4, Lio/sqlc/SQLitePlugin$DBQuery;

    const/4 v5, 0x1

    invoke-direct {v4, p0, v5, p2}, Lio/sqlc/SQLitePlugin$DBQuery;-><init>(Lio/sqlc/SQLitePlugin;ZLorg/apache/cordova/CallbackContext;)V

    invoke-interface {v3, v4}, Ljava/util/concurrent/BlockingQueue;->put(Ljava/lang/Object;)V
    :try_end_0
    .catch Ljava/lang/Exception; {:try_start_0 .. :try_end_0} :catch_0

    .line 286
    :goto_0
    return-void

    .line 272
    :catch_0
    move-exception v1

    .line 273
    .local v1, "e":Ljava/lang/Exception;
    if-eqz p2, :cond_0

    .line 274
    new-instance v3, Ljava/lang/StringBuilder;

    invoke-direct {v3}, Ljava/lang/StringBuilder;-><init>()V

    const-string v4, "couldn\'t close database"

    invoke-virtual {v3, v4}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v3

    invoke-virtual {v3, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/Object;)Ljava/lang/StringBuilder;

    move-result-object v3

    invoke-virtual {v3}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v3

    invoke-virtual {p2, v3}, Lorg/apache/cordova/CallbackContext;->error(Ljava/lang/String;)V

    .line 276
    :cond_0
    const-class v3, Lio/sqlc/SQLitePlugin;

    invoke-virtual {v3}, Ljava/lang/Class;->getSimpleName()Ljava/lang/String;

    move-result-object v3

    const-string v4, "couldn\'t close database"

    invoke-static {v3, v4, v1}, Landroid/util/Log;->e(Ljava/lang/String;Ljava/lang/String;Ljava/lang/Throwable;)I

    goto :goto_0

    .line 279
    .end local v1    # "e":Ljava/lang/Exception;
    :cond_1
    invoke-direct {p0, p1}, Lio/sqlc/SQLitePlugin;->deleteDatabaseNow(Ljava/lang/String;)Z

    move-result v0

    .line 280
    .local v0, "deleteResult":Z
    if-eqz v0, :cond_2

    .line 281
    invoke-virtual {p2}, Lorg/apache/cordova/CallbackContext;->success()V

    goto :goto_0

    .line 283
    :cond_2
    const-string v3, "couldn\'t delete database"

    invoke-virtual {p2, v3}, Lorg/apache/cordova/CallbackContext;->error(Ljava/lang/String;)V

    goto :goto_0
.end method

.method private deleteDatabaseNow(Ljava/lang/String;)Z
    .locals 4
    .param p1, "dbname"    # Ljava/lang/String;

    .prologue
    .line 296
    iget-object v2, p0, Lio/sqlc/SQLitePlugin;->cordova:Lorg/apache/cordova/CordovaInterface;

    invoke-interface {v2}, Lorg/apache/cordova/CordovaInterface;->getActivity()Landroid/app/Activity;

    move-result-object v2

    invoke-virtual {v2, p1}, Landroid/app/Activity;->getDatabasePath(Ljava/lang/String;)Ljava/io/File;

    move-result-object v0

    .line 299
    .local v0, "dbfile":Ljava/io/File;
    :try_start_0
    iget-object v2, p0, Lio/sqlc/SQLitePlugin;->cordova:Lorg/apache/cordova/CordovaInterface;

    invoke-interface {v2}, Lorg/apache/cordova/CordovaInterface;->getActivity()Landroid/app/Activity;

    move-result-object v2

    invoke-virtual {v0}, Ljava/io/File;->getAbsolutePath()Ljava/lang/String;

    move-result-object v3

    invoke-virtual {v2, v3}, Landroid/app/Activity;->deleteDatabase(Ljava/lang/String;)Z
    :try_end_0
    .catch Ljava/lang/Exception; {:try_start_0 .. :try_end_0} :catch_0

    move-result v2

    .line 302
    :goto_0
    return v2

    .line 300
    :catch_0
    move-exception v1

    .line 301
    .local v1, "e":Ljava/lang/Exception;
    const-class v2, Lio/sqlc/SQLitePlugin;

    invoke-virtual {v2}, Ljava/lang/Class;->getSimpleName()Ljava/lang/String;

    move-result-object v2

    const-string v3, "couldn\'t delete database"

    invoke-static {v2, v3, v1}, Landroid/util/Log;->e(Ljava/lang/String;Ljava/lang/String;Ljava/lang/Throwable;)I

    .line 302
    const/4 v2, 0x0

    goto :goto_0
.end method

.method private executeAndPossiblyThrow(Lio/sqlc/SQLitePlugin$Action;Lorg/json/JSONArray;Lorg/apache/cordova/CallbackContext;)Z
    .locals 19
    .param p1, "action"    # Lio/sqlc/SQLitePlugin$Action;
    .param p2, "args"    # Lorg/json/JSONArray;
    .param p3, "cbc"    # Lorg/apache/cordova/CallbackContext;
    .annotation system Ldalvik/annotation/Throws;
        value = {
            Lorg/json/JSONException;
        }
    .end annotation

    .prologue
    .line 85
    const/4 v15, 0x1

    .line 90
    .local v15, "status":Z
    sget-object v17, Lio/sqlc/SQLitePlugin$1;->$SwitchMap$io$sqlc$SQLitePlugin$Action:[I

    invoke-virtual/range {p1 .. p1}, Lio/sqlc/SQLitePlugin$Action;->ordinal()I

    move-result v18

    aget v17, v17, v18

    packed-switch v17, :pswitch_data_0

    .line 156
    :goto_0
    return v15

    .line 92
    :pswitch_0
    const/16 v17, 0x0

    move-object/from16 v0, p2

    move/from16 v1, v17

    invoke-virtual {v0, v1}, Lorg/json/JSONArray;->getJSONObject(I)Lorg/json/JSONObject;

    move-result-object v11

    .line 93
    .local v11, "o":Lorg/json/JSONObject;
    const-string v17, "value"

    move-object/from16 v0, v17

    invoke-virtual {v11, v0}, Lorg/json/JSONObject;->getString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v7

    .line 94
    .local v7, "echo_value":Ljava/lang/String;
    move-object/from16 v0, p3

    invoke-virtual {v0, v7}, Lorg/apache/cordova/CallbackContext;->success(Ljava/lang/String;)V

    goto :goto_0

    .line 98
    .end local v7    # "echo_value":Ljava/lang/String;
    .end local v11    # "o":Lorg/json/JSONObject;
    :pswitch_1
    const/16 v17, 0x0

    move-object/from16 v0, p2

    move/from16 v1, v17

    invoke-virtual {v0, v1}, Lorg/json/JSONArray;->getJSONObject(I)Lorg/json/JSONObject;

    move-result-object v11

    .line 99
    .restart local v11    # "o":Lorg/json/JSONObject;
    const-string v17, "name"

    move-object/from16 v0, v17

    invoke-virtual {v11, v0}, Lorg/json/JSONObject;->getString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v5

    .line 101
    .local v5, "dbname":Ljava/lang/String;
    move-object/from16 v0, p0

    move-object/from16 v1, p3

    invoke-direct {v0, v5, v11, v1}, Lio/sqlc/SQLitePlugin;->startDatabase(Ljava/lang/String;Lorg/json/JSONObject;Lorg/apache/cordova/CallbackContext;)V

    goto :goto_0

    .line 105
    .end local v5    # "dbname":Ljava/lang/String;
    .end local v11    # "o":Lorg/json/JSONObject;
    :pswitch_2
    const/16 v17, 0x0

    move-object/from16 v0, p2

    move/from16 v1, v17

    invoke-virtual {v0, v1}, Lorg/json/JSONArray;->getJSONObject(I)Lorg/json/JSONObject;

    move-result-object v11

    .line 106
    .restart local v11    # "o":Lorg/json/JSONObject;
    const-string v17, "path"

    move-object/from16 v0, v17

    invoke-virtual {v11, v0}, Lorg/json/JSONObject;->getString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v5

    .line 108
    .restart local v5    # "dbname":Ljava/lang/String;
    move-object/from16 v0, p0

    move-object/from16 v1, p3

    invoke-direct {v0, v5, v1}, Lio/sqlc/SQLitePlugin;->closeDatabase(Ljava/lang/String;Lorg/apache/cordova/CallbackContext;)V

    goto :goto_0

    .line 112
    .end local v5    # "dbname":Ljava/lang/String;
    .end local v11    # "o":Lorg/json/JSONObject;
    :pswitch_3
    const/16 v17, 0x0

    move-object/from16 v0, p2

    move/from16 v1, v17

    invoke-virtual {v0, v1}, Lorg/json/JSONArray;->getJSONObject(I)Lorg/json/JSONObject;

    move-result-object v11

    .line 113
    .restart local v11    # "o":Lorg/json/JSONObject;
    const-string v17, "path"

    move-object/from16 v0, v17

    invoke-virtual {v11, v0}, Lorg/json/JSONObject;->getString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v5

    .line 115
    .restart local v5    # "dbname":Ljava/lang/String;
    move-object/from16 v0, p0

    move-object/from16 v1, p3

    invoke-direct {v0, v5, v1}, Lio/sqlc/SQLitePlugin;->deleteDatabase(Ljava/lang/String;Lorg/apache/cordova/CallbackContext;)V

    goto :goto_0

    .line 121
    .end local v5    # "dbname":Ljava/lang/String;
    .end local v11    # "o":Lorg/json/JSONObject;
    :pswitch_4
    const/16 v17, 0x0

    move-object/from16 v0, p2

    move/from16 v1, v17

    invoke-virtual {v0, v1}, Lorg/json/JSONArray;->getJSONObject(I)Lorg/json/JSONObject;

    move-result-object v3

    .line 122
    .local v3, "allargs":Lorg/json/JSONObject;
    const-string v17, "dbargs"

    move-object/from16 v0, v17

    invoke-virtual {v3, v0}, Lorg/json/JSONObject;->getJSONObject(Ljava/lang/String;)Lorg/json/JSONObject;

    move-result-object v4

    .line 123
    .local v4, "dbargs":Lorg/json/JSONObject;
    const-string v17, "dbname"

    move-object/from16 v0, v17

    invoke-virtual {v4, v0}, Lorg/json/JSONObject;->getString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v5

    .line 124
    .restart local v5    # "dbname":Ljava/lang/String;
    const-string v17, "executes"

    move-object/from16 v0, v17

    invoke-virtual {v3, v0}, Lorg/json/JSONObject;->getJSONArray(Ljava/lang/String;)Lorg/json/JSONArray;

    move-result-object v16

    .line 126
    .local v16, "txargs":Lorg/json/JSONArray;
    const/16 v17, 0x0

    invoke-virtual/range {v16 .. v17}, Lorg/json/JSONArray;->isNull(I)Z

    move-result v17

    if-eqz v17, :cond_0

    .line 127
    const-string v17, "missing executes list"

    move-object/from16 v0, p3

    move-object/from16 v1, v17

    invoke-virtual {v0, v1}, Lorg/apache/cordova/CallbackContext;->error(Ljava/lang/String;)V

    goto/16 :goto_0

    .line 129
    :cond_0
    invoke-virtual/range {v16 .. v16}, Lorg/json/JSONArray;->length()I

    move-result v10

    .line 130
    .local v10, "len":I
    new-array v13, v10, [Ljava/lang/String;

    .line 131
    .local v13, "queries":[Ljava/lang/String;
    new-array v9, v10, [Lorg/json/JSONArray;

    .line 133
    .local v9, "jsonparams":[Lorg/json/JSONArray;
    const/4 v8, 0x0

    .local v8, "i":I
    :goto_1
    if-ge v8, v10, :cond_1

    .line 134
    move-object/from16 v0, v16

    invoke-virtual {v0, v8}, Lorg/json/JSONArray;->getJSONObject(I)Lorg/json/JSONObject;

    move-result-object v2

    .line 135
    .local v2, "a":Lorg/json/JSONObject;
    const-string v17, "sql"

    move-object/from16 v0, v17

    invoke-virtual {v2, v0}, Lorg/json/JSONObject;->getString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v17

    aput-object v17, v13, v8

    .line 136
    const-string v17, "params"

    move-object/from16 v0, v17

    invoke-virtual {v2, v0}, Lorg/json/JSONObject;->getJSONArray(Ljava/lang/String;)Lorg/json/JSONArray;

    move-result-object v17

    aput-object v17, v9, v8

    .line 133
    add-int/lit8 v8, v8, 0x1

    goto :goto_1

    .line 140
    .end local v2    # "a":Lorg/json/JSONObject;
    :cond_1
    new-instance v12, Lio/sqlc/SQLitePlugin$DBQuery;

    move-object/from16 v0, p0

    move-object/from16 v1, p3

    invoke-direct {v12, v0, v13, v9, v1}, Lio/sqlc/SQLitePlugin$DBQuery;-><init>(Lio/sqlc/SQLitePlugin;[Ljava/lang/String;[Lorg/json/JSONArray;Lorg/apache/cordova/CallbackContext;)V

    .line 141
    .local v12, "q":Lio/sqlc/SQLitePlugin$DBQuery;
    sget-object v17, Lio/sqlc/SQLitePlugin;->dbrmap:Ljava/util/Map;

    move-object/from16 v0, v17

    invoke-interface {v0, v5}, Ljava/util/Map;->get(Ljava/lang/Object;)Ljava/lang/Object;

    move-result-object v14

    check-cast v14, Lio/sqlc/SQLitePlugin$DBRunner;

    .line 142
    .local v14, "r":Lio/sqlc/SQLitePlugin$DBRunner;
    if-eqz v14, :cond_2

    .line 144
    :try_start_0
    iget-object v0, v14, Lio/sqlc/SQLitePlugin$DBRunner;->q:Ljava/util/concurrent/BlockingQueue;

    move-object/from16 v17, v0

    move-object/from16 v0, v17

    invoke-interface {v0, v12}, Ljava/util/concurrent/BlockingQueue;->put(Ljava/lang/Object;)V
    :try_end_0
    .catch Ljava/lang/Exception; {:try_start_0 .. :try_end_0} :catch_0

    goto/16 :goto_0

    .line 145
    :catch_0
    move-exception v6

    .line 146
    .local v6, "e":Ljava/lang/Exception;
    const-class v17, Lio/sqlc/SQLitePlugin;

    invoke-virtual/range {v17 .. v17}, Ljava/lang/Class;->getSimpleName()Ljava/lang/String;

    move-result-object v17

    const-string v18, "couldn\'t add to queue"

    move-object/from16 v0, v17

    move-object/from16 v1, v18

    invoke-static {v0, v1, v6}, Landroid/util/Log;->e(Ljava/lang/String;Ljava/lang/String;Ljava/lang/Throwable;)I

    .line 147
    const-string v17, "couldn\'t add to queue"

    move-object/from16 v0, p3

    move-object/from16 v1, v17

    invoke-virtual {v0, v1}, Lorg/apache/cordova/CallbackContext;->error(Ljava/lang/String;)V

    goto/16 :goto_0

    .line 150
    .end local v6    # "e":Ljava/lang/Exception;
    :cond_2
    const-string v17, "database not open"

    move-object/from16 v0, p3

    move-object/from16 v1, v17

    invoke-virtual {v0, v1}, Lorg/apache/cordova/CallbackContext;->error(Ljava/lang/String;)V

    goto/16 :goto_0

    .line 90
    :pswitch_data_0
    .packed-switch 0x1
        :pswitch_0
        :pswitch_1
        :pswitch_2
        :pswitch_3
        :pswitch_4
        :pswitch_4
    .end packed-switch
.end method

.method private openDatabase(Ljava/lang/String;Lorg/apache/cordova/CallbackContext;Z)Lio/sqlc/SQLiteAndroidDatabase;
    .locals 6
    .param p1, "dbname"    # Ljava/lang/String;
    .param p2, "cbc"    # Lorg/apache/cordova/CallbackContext;
    .param p3, "old_impl"    # Z
    .annotation system Ldalvik/annotation/Throws;
        value = {
            Ljava/lang/Exception;
        }
    .end annotation

    .prologue
    .line 206
    :try_start_0
    iget-object v3, p0, Lio/sqlc/SQLitePlugin;->cordova:Lorg/apache/cordova/CordovaInterface;

    invoke-interface {v3}, Lorg/apache/cordova/CordovaInterface;->getActivity()Landroid/app/Activity;

    move-result-object v3

    invoke-virtual {v3, p1}, Landroid/app/Activity;->getDatabasePath(Ljava/lang/String;)Ljava/io/File;

    move-result-object v0

    .line 208
    .local v0, "dbfile":Ljava/io/File;
    invoke-virtual {v0}, Ljava/io/File;->exists()Z

    move-result v3

    if-nez v3, :cond_0

    .line 209
    invoke-virtual {v0}, Ljava/io/File;->getParentFile()Ljava/io/File;

    move-result-object v3

    invoke-virtual {v3}, Ljava/io/File;->mkdirs()Z

    .line 212
    :cond_0
    const-string v3, "info"

    new-instance v4, Ljava/lang/StringBuilder;

    invoke-direct {v4}, Ljava/lang/StringBuilder;-><init>()V

    const-string v5, "Open sqlite db: "

    invoke-virtual {v4, v5}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v4

    invoke-virtual {v0}, Ljava/io/File;->getAbsolutePath()Ljava/lang/String;

    move-result-object v5

    invoke-virtual {v4, v5}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v4

    invoke-virtual {v4}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v4

    invoke-static {v3, v4}, Landroid/util/Log;->v(Ljava/lang/String;Ljava/lang/String;)I

    .line 214
    if-eqz p3, :cond_2

    new-instance v2, Lio/sqlc/SQLiteAndroidDatabase;

    invoke-direct {v2}, Lio/sqlc/SQLiteAndroidDatabase;-><init>()V

    .line 215
    .local v2, "mydb":Lio/sqlc/SQLiteAndroidDatabase;
    :goto_0
    invoke-virtual {v2, v0}, Lio/sqlc/SQLiteAndroidDatabase;->open(Ljava/io/File;)V

    .line 217
    if-eqz p2, :cond_1

    .line 218
    invoke-virtual {p2}, Lorg/apache/cordova/CallbackContext;->success()V

    .line 220
    :cond_1
    return-object v2

    .line 214
    .end local v2    # "mydb":Lio/sqlc/SQLiteAndroidDatabase;
    :cond_2
    new-instance v2, Lio/sqlc/SQLiteConnectorDatabase;

    invoke-direct {v2}, Lio/sqlc/SQLiteConnectorDatabase;-><init>()V
    :try_end_0
    .catch Ljava/lang/Exception; {:try_start_0 .. :try_end_0} :catch_0

    goto :goto_0

    .line 221
    .end local v0    # "dbfile":Ljava/io/File;
    :catch_0
    move-exception v1

    .line 222
    .local v1, "e":Ljava/lang/Exception;
    if-eqz p2, :cond_3

    .line 223
    new-instance v3, Ljava/lang/StringBuilder;

    invoke-direct {v3}, Ljava/lang/StringBuilder;-><init>()V

    const-string v4, "can\'t open database "

    invoke-virtual {v3, v4}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v3

    invoke-virtual {v3, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/Object;)Ljava/lang/StringBuilder;

    move-result-object v3

    invoke-virtual {v3}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v3

    invoke-virtual {p2, v3}, Lorg/apache/cordova/CallbackContext;->error(Ljava/lang/String;)V

    .line 224
    :cond_3
    throw v1
.end method

.method private startDatabase(Ljava/lang/String;Lorg/json/JSONObject;Lorg/apache/cordova/CallbackContext;)V
    .locals 3
    .param p1, "dbname"    # Ljava/lang/String;
    .param p2, "options"    # Lorg/json/JSONObject;
    .param p3, "cbc"    # Lorg/apache/cordova/CallbackContext;

    .prologue
    .line 185
    sget-object v1, Lio/sqlc/SQLitePlugin;->dbrmap:Ljava/util/Map;

    invoke-interface {v1, p1}, Ljava/util/Map;->get(Ljava/lang/Object;)Ljava/lang/Object;

    move-result-object v0

    check-cast v0, Lio/sqlc/SQLitePlugin$DBRunner;

    .line 187
    .local v0, "r":Lio/sqlc/SQLitePlugin$DBRunner;
    if-eqz v0, :cond_0

    .line 189
    new-instance v1, Ljava/lang/StringBuilder;

    invoke-direct {v1}, Ljava/lang/StringBuilder;-><init>()V

    const-string v2, "INTERNAL ERROR: database already open for db name: "

    invoke-virtual {v1, v2}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v1

    invoke-virtual {v1, p1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v1

    invoke-virtual {v1}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v1

    invoke-virtual {p3, v1}, Lorg/apache/cordova/CallbackContext;->error(Ljava/lang/String;)V

    .line 195
    :goto_0
    return-void

    .line 191
    :cond_0
    new-instance v0, Lio/sqlc/SQLitePlugin$DBRunner;

    .end local v0    # "r":Lio/sqlc/SQLitePlugin$DBRunner;
    invoke-direct {v0, p0, p1, p2, p3}, Lio/sqlc/SQLitePlugin$DBRunner;-><init>(Lio/sqlc/SQLitePlugin;Ljava/lang/String;Lorg/json/JSONObject;Lorg/apache/cordova/CallbackContext;)V

    .line 192
    .restart local v0    # "r":Lio/sqlc/SQLitePlugin$DBRunner;
    sget-object v1, Lio/sqlc/SQLitePlugin;->dbrmap:Ljava/util/Map;

    invoke-interface {v1, p1, v0}, Ljava/util/Map;->put(Ljava/lang/Object;Ljava/lang/Object;)Ljava/lang/Object;

    .line 193
    iget-object v1, p0, Lio/sqlc/SQLitePlugin;->cordova:Lorg/apache/cordova/CordovaInterface;

    invoke-interface {v1}, Lorg/apache/cordova/CordovaInterface;->getThreadPool()Ljava/util/concurrent/ExecutorService;

    move-result-object v1

    invoke-interface {v1, v0}, Ljava/util/concurrent/ExecutorService;->execute(Ljava/lang/Runnable;)V

    goto :goto_0
.end method


# virtual methods
.method public execute(Ljava/lang/String;Lorg/json/JSONArray;Lorg/apache/cordova/CallbackContext;)Z
    .locals 5
    .param p1, "actionAsString"    # Ljava/lang/String;
    .param p2, "args"    # Lorg/json/JSONArray;
    .param p3, "cbc"    # Lorg/apache/cordova/CallbackContext;

    .prologue
    const/4 v2, 0x0

    .line 66
    :try_start_0
    invoke-static {p1}, Lio/sqlc/SQLitePlugin$Action;->valueOf(Ljava/lang/String;)Lio/sqlc/SQLitePlugin$Action;
    :try_end_0
    .catch Ljava/lang/IllegalArgumentException; {:try_start_0 .. :try_end_0} :catch_0

    move-result-object v0

    .line 74
    .local v0, "action":Lio/sqlc/SQLitePlugin$Action;
    :try_start_1
    invoke-direct {p0, v0, p2, p3}, Lio/sqlc/SQLitePlugin;->executeAndPossiblyThrow(Lio/sqlc/SQLitePlugin$Action;Lorg/json/JSONArray;Lorg/apache/cordova/CallbackContext;)Z
    :try_end_1
    .catch Lorg/json/JSONException; {:try_start_1 .. :try_end_1} :catch_1

    move-result v2

    .line 78
    .end local v0    # "action":Lio/sqlc/SQLitePlugin$Action;
    :goto_0
    return v2

    .line 67
    :catch_0
    move-exception v1

    .line 69
    .local v1, "e":Ljava/lang/IllegalArgumentException;
    const-class v3, Lio/sqlc/SQLitePlugin;

    invoke-virtual {v3}, Ljava/lang/Class;->getSimpleName()Ljava/lang/String;

    move-result-object v3

    const-string v4, "unexpected error"

    invoke-static {v3, v4, v1}, Landroid/util/Log;->e(Ljava/lang/String;Ljava/lang/String;Ljava/lang/Throwable;)I

    goto :goto_0

    .line 75
    .end local v1    # "e":Ljava/lang/IllegalArgumentException;
    .restart local v0    # "action":Lio/sqlc/SQLitePlugin$Action;
    :catch_1
    move-exception v1

    .line 77
    .local v1, "e":Lorg/json/JSONException;
    const-class v3, Lio/sqlc/SQLitePlugin;

    invoke-virtual {v3}, Ljava/lang/Class;->getSimpleName()Ljava/lang/String;

    move-result-object v3

    const-string v4, "unexpected error"

    invoke-static {v3, v4, v1}, Landroid/util/Log;->e(Ljava/lang/String;Ljava/lang/String;Ljava/lang/Throwable;)I

    goto :goto_0
.end method

.method public onDestroy()V
    .locals 5

    .prologue
    .line 164
    :goto_0
    sget-object v3, Lio/sqlc/SQLitePlugin;->dbrmap:Ljava/util/Map;

    invoke-interface {v3}, Ljava/util/Map;->isEmpty()Z

    move-result v3

    if-nez v3, :cond_0

    .line 165
    sget-object v3, Lio/sqlc/SQLitePlugin;->dbrmap:Ljava/util/Map;

    invoke-interface {v3}, Ljava/util/Map;->keySet()Ljava/util/Set;

    move-result-object v3

    invoke-interface {v3}, Ljava/util/Set;->iterator()Ljava/util/Iterator;

    move-result-object v3

    invoke-interface {v3}, Ljava/util/Iterator;->next()Ljava/lang/Object;

    move-result-object v0

    check-cast v0, Ljava/lang/String;

    .line 167
    .local v0, "dbname":Ljava/lang/String;
    invoke-direct {p0, v0}, Lio/sqlc/SQLitePlugin;->closeDatabaseNow(Ljava/lang/String;)V

    .line 169
    sget-object v3, Lio/sqlc/SQLitePlugin;->dbrmap:Ljava/util/Map;

    invoke-interface {v3, v0}, Ljava/util/Map;->get(Ljava/lang/Object;)Ljava/lang/Object;

    move-result-object v2

    check-cast v2, Lio/sqlc/SQLitePlugin$DBRunner;

    .line 172
    .local v2, "r":Lio/sqlc/SQLitePlugin$DBRunner;
    :try_start_0
    iget-object v3, v2, Lio/sqlc/SQLitePlugin$DBRunner;->q:Ljava/util/concurrent/BlockingQueue;

    new-instance v4, Lio/sqlc/SQLitePlugin$DBQuery;

    invoke-direct {v4, p0}, Lio/sqlc/SQLitePlugin$DBQuery;-><init>(Lio/sqlc/SQLitePlugin;)V

    invoke-interface {v3, v4}, Ljava/util/concurrent/BlockingQueue;->put(Ljava/lang/Object;)V
    :try_end_0
    .catch Ljava/lang/Exception; {:try_start_0 .. :try_end_0} :catch_0

    .line 176
    :goto_1
    sget-object v3, Lio/sqlc/SQLitePlugin;->dbrmap:Ljava/util/Map;

    invoke-interface {v3, v0}, Ljava/util/Map;->remove(Ljava/lang/Object;)Ljava/lang/Object;

    goto :goto_0

    .line 173
    :catch_0
    move-exception v1

    .line 174
    .local v1, "e":Ljava/lang/Exception;
    const-class v3, Lio/sqlc/SQLitePlugin;

    invoke-virtual {v3}, Ljava/lang/Class;->getSimpleName()Ljava/lang/String;

    move-result-object v3

    const-string v4, "couldn\'t stop db thread"

    invoke-static {v3, v4, v1}, Landroid/util/Log;->e(Ljava/lang/String;Ljava/lang/String;Ljava/lang/Throwable;)I

    goto :goto_1

    .line 178
    .end local v0    # "dbname":Ljava/lang/String;
    .end local v1    # "e":Ljava/lang/Exception;
    .end local v2    # "r":Lio/sqlc/SQLitePlugin$DBRunner;
    :cond_0
    return-void
.end method
