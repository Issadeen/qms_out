.class Lio/sqlc/SQLiteConnectorDatabase;
.super Lio/sqlc/SQLiteAndroidDatabase;
.source "SQLiteConnectorDatabase.java"


# static fields
.field static connector:Lio/liteglue/SQLiteConnector;


# instance fields
.field mydb:Lio/liteglue/SQLiteConnection;


# direct methods
.method static constructor <clinit>()V
    .locals 1

    .prologue
    .line 41
    new-instance v0, Lio/liteglue/SQLiteConnector;

    invoke-direct {v0}, Lio/liteglue/SQLiteConnector;-><init>()V

    sput-object v0, Lio/sqlc/SQLiteConnectorDatabase;->connector:Lio/liteglue/SQLiteConnector;

    return-void
.end method

.method constructor <init>()V
    .locals 0

    .prologue
    .line 39
    invoke-direct {p0}, Lio/sqlc/SQLiteAndroidDatabase;-><init>()V

    return-void
.end method

.method private executeSQLiteStatement(Ljava/lang/String;Lorg/json/JSONArray;Lorg/apache/cordova/CallbackContext;)Lorg/json/JSONObject;
    .locals 18
    .param p1, "query"    # Ljava/lang/String;
    .param p2, "paramsAsJson"    # Lorg/json/JSONArray;
    .param p3, "cbc"    # Lorg/apache/cordova/CallbackContext;
    .annotation system Ldalvik/annotation/Throws;
        value = {
            Lorg/json/JSONException;,
            Ljava/sql/SQLException;
        }
    .end annotation

    .prologue
    .line 189
    new-instance v14, Lorg/json/JSONObject;

    invoke-direct {v14}, Lorg/json/JSONObject;-><init>()V

    .line 191
    .local v14, "rowsResult":Lorg/json/JSONObject;
    const/4 v6, 0x0

    .line 193
    .local v6, "hasRows":Z
    move-object/from16 v0, p0

    iget-object v15, v0, Lio/sqlc/SQLiteConnectorDatabase;->mydb:Lio/liteglue/SQLiteConnection;

    move-object/from16 v0, p1

    invoke-interface {v15, v0}, Lio/liteglue/SQLiteConnection;->prepareStatement(Ljava/lang/String;)Lio/liteglue/SQLiteStatement;

    move-result-object v9

    .line 196
    .local v9, "myStatement":Lio/liteglue/SQLiteStatement;
    const/4 v11, 0x0

    .line 198
    .local v11, "params":[Ljava/lang/String;
    :try_start_0
    invoke-virtual/range {p2 .. p2}, Lorg/json/JSONArray;->length()I

    move-result v15

    new-array v11, v15, [Ljava/lang/String;

    .line 200
    const/4 v7, 0x0

    .local v7, "i":I
    :goto_0
    invoke-virtual/range {p2 .. p2}, Lorg/json/JSONArray;->length()I

    move-result v15

    if-ge v7, v15, :cond_4

    .line 201
    move-object/from16 v0, p2

    invoke-virtual {v0, v7}, Lorg/json/JSONArray;->isNull(I)Z

    move-result v15

    if-eqz v15, :cond_0

    .line 202
    add-int/lit8 v15, v7, 0x1

    invoke-interface {v9, v15}, Lio/liteglue/SQLiteStatement;->bindNull(I)V

    .line 200
    :goto_1
    add-int/lit8 v7, v7, 0x1

    goto :goto_0

    .line 204
    :cond_0
    move-object/from16 v0, p2

    invoke-virtual {v0, v7}, Lorg/json/JSONArray;->get(I)Ljava/lang/Object;

    move-result-object v10

    .line 205
    .local v10, "p":Ljava/lang/Object;
    instance-of v15, v10, Ljava/lang/Float;

    if-nez v15, :cond_1

    instance-of v15, v10, Ljava/lang/Double;

    if-eqz v15, :cond_2

    .line 206
    :cond_1
    add-int/lit8 v15, v7, 0x1

    move-object/from16 v0, p2

    invoke-virtual {v0, v7}, Lorg/json/JSONArray;->getDouble(I)D

    move-result-wide v16

    move-wide/from16 v0, v16

    invoke-interface {v9, v15, v0, v1}, Lio/liteglue/SQLiteStatement;->bindDouble(ID)V
    :try_end_0
    .catch Ljava/sql/SQLException; {:try_start_0 .. :try_end_0} :catch_0
    .catch Lorg/json/JSONException; {:try_start_0 .. :try_end_0} :catch_1

    goto :goto_1

    .line 215
    .end local v7    # "i":I
    .end local v10    # "p":Ljava/lang/Object;
    :catch_0
    move-exception v5

    .line 216
    .local v5, "ex":Ljava/sql/SQLException;
    invoke-virtual {v5}, Ljava/sql/SQLException;->printStackTrace()V

    .line 217
    invoke-virtual {v5}, Ljava/sql/SQLException;->getMessage()Ljava/lang/String;

    move-result-object v4

    .line 218
    .local v4, "errorMessage":Ljava/lang/String;
    const-string v15, "executeSqlBatch"

    new-instance v16, Ljava/lang/StringBuilder;

    invoke-direct/range {v16 .. v16}, Ljava/lang/StringBuilder;-><init>()V

    const-string v17, "SQLitePlugin.executeSql[Batch](): Error="

    invoke-virtual/range {v16 .. v17}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v16

    move-object/from16 v0, v16

    invoke-virtual {v0, v4}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v16

    invoke-virtual/range {v16 .. v16}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v16

    invoke-static/range {v15 .. v16}, Landroid/util/Log;->v(Ljava/lang/String;Ljava/lang/String;)I

    .line 221
    invoke-interface {v9}, Lio/liteglue/SQLiteStatement;->dispose()V

    .line 222
    throw v5

    .line 207
    .end local v4    # "errorMessage":Ljava/lang/String;
    .end local v5    # "ex":Ljava/sql/SQLException;
    .restart local v7    # "i":I
    .restart local v10    # "p":Ljava/lang/Object;
    :cond_2
    :try_start_1
    instance-of v15, v10, Ljava/lang/Number;

    if-eqz v15, :cond_3

    .line 208
    add-int/lit8 v15, v7, 0x1

    move-object/from16 v0, p2

    invoke-virtual {v0, v7}, Lorg/json/JSONArray;->getLong(I)J

    move-result-wide v16

    move-wide/from16 v0, v16

    invoke-interface {v9, v15, v0, v1}, Lio/liteglue/SQLiteStatement;->bindLong(IJ)V
    :try_end_1
    .catch Ljava/sql/SQLException; {:try_start_1 .. :try_end_1} :catch_0
    .catch Lorg/json/JSONException; {:try_start_1 .. :try_end_1} :catch_1

    goto :goto_1

    .line 223
    .end local v7    # "i":I
    .end local v10    # "p":Ljava/lang/Object;
    :catch_1
    move-exception v5

    .line 224
    .local v5, "ex":Lorg/json/JSONException;
    invoke-virtual {v5}, Lorg/json/JSONException;->printStackTrace()V

    .line 225
    invoke-virtual {v5}, Lorg/json/JSONException;->getMessage()Ljava/lang/String;

    move-result-object v4

    .line 226
    .restart local v4    # "errorMessage":Ljava/lang/String;
    const-string v15, "executeSqlBatch"

    new-instance v16, Ljava/lang/StringBuilder;

    invoke-direct/range {v16 .. v16}, Ljava/lang/StringBuilder;-><init>()V

    const-string v17, "SQLitePlugin.executeSql[Batch](): Error="

    invoke-virtual/range {v16 .. v17}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v16

    move-object/from16 v0, v16

    invoke-virtual {v0, v4}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v16

    invoke-virtual/range {v16 .. v16}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v16

    invoke-static/range {v15 .. v16}, Landroid/util/Log;->v(Ljava/lang/String;Ljava/lang/String;)I

    .line 229
    invoke-interface {v9}, Lio/liteglue/SQLiteStatement;->dispose()V

    .line 230
    throw v5

    .line 210
    .end local v4    # "errorMessage":Ljava/lang/String;
    .end local v5    # "ex":Lorg/json/JSONException;
    .restart local v7    # "i":I
    .restart local v10    # "p":Ljava/lang/Object;
    :cond_3
    add-int/lit8 v15, v7, 0x1

    :try_start_2
    move-object/from16 v0, p2

    invoke-virtual {v0, v7}, Lorg/json/JSONArray;->getString(I)Ljava/lang/String;

    move-result-object v16

    move-object/from16 v0, v16

    invoke-interface {v9, v15, v0}, Lio/liteglue/SQLiteStatement;->bindTextNativeString(ILjava/lang/String;)V

    goto/16 :goto_1

    .line 214
    .end local v10    # "p":Ljava/lang/Object;
    :cond_4
    invoke-interface {v9}, Lio/liteglue/SQLiteStatement;->step()Z
    :try_end_2
    .catch Ljava/sql/SQLException; {:try_start_2 .. :try_end_2} :catch_0
    .catch Lorg/json/JSONException; {:try_start_2 .. :try_end_2} :catch_1

    move-result v6

    .line 234
    if-eqz v6, :cond_6

    .line 235
    new-instance v13, Lorg/json/JSONArray;

    invoke-direct {v13}, Lorg/json/JSONArray;-><init>()V

    .line 236
    .local v13, "rowsArrayResult":Lorg/json/JSONArray;
    const-string v8, ""

    .line 237
    .local v8, "key":Ljava/lang/String;
    invoke-interface {v9}, Lio/liteglue/SQLiteStatement;->getColumnCount()I

    move-result v2

    .line 241
    .local v2, "colCount":I
    :cond_5
    new-instance v12, Lorg/json/JSONObject;

    invoke-direct {v12}, Lorg/json/JSONObject;-><init>()V

    .line 243
    .local v12, "row":Lorg/json/JSONObject;
    const/4 v7, 0x0

    :goto_2
    if-ge v7, v2, :cond_7

    .line 244
    :try_start_3
    invoke-interface {v9, v7}, Lio/liteglue/SQLiteStatement;->getColumnName(I)Ljava/lang/String;

    move-result-object v8

    .line 246
    invoke-interface {v9, v7}, Lio/liteglue/SQLiteStatement;->getColumnType(I)I

    move-result v15

    packed-switch v15, :pswitch_data_0

    .line 262
    :pswitch_0
    invoke-interface {v9, v7}, Lio/liteglue/SQLiteStatement;->getColumnTextNativeString(I)Ljava/lang/String;

    move-result-object v15

    invoke-virtual {v12, v8, v15}, Lorg/json/JSONObject;->put(Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    .line 243
    :goto_3
    add-int/lit8 v7, v7, 0x1

    goto :goto_2

    .line 248
    :pswitch_1
    sget-object v15, Lorg/json/JSONObject;->NULL:Ljava/lang/Object;

    invoke-virtual {v12, v8, v15}, Lorg/json/JSONObject;->put(Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;
    :try_end_3
    .catch Lorg/json/JSONException; {:try_start_3 .. :try_end_3} :catch_2

    goto :goto_3

    .line 269
    :catch_2
    move-exception v3

    .line 270
    .local v3, "e":Lorg/json/JSONException;
    invoke-virtual {v3}, Lorg/json/JSONException;->printStackTrace()V

    .line 272
    .end local v3    # "e":Lorg/json/JSONException;
    :goto_4
    invoke-interface {v9}, Lio/liteglue/SQLiteStatement;->step()Z

    move-result v15

    if-nez v15, :cond_5

    .line 275
    :try_start_4
    const-string v15, "rows"

    invoke-virtual {v14, v15, v13}, Lorg/json/JSONObject;->put(Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;
    :try_end_4
    .catch Lorg/json/JSONException; {:try_start_4 .. :try_end_4} :catch_3

    .line 281
    .end local v2    # "colCount":I
    .end local v8    # "key":Ljava/lang/String;
    .end local v12    # "row":Lorg/json/JSONObject;
    .end local v13    # "rowsArrayResult":Lorg/json/JSONArray;
    :cond_6
    :goto_5
    invoke-interface {v9}, Lio/liteglue/SQLiteStatement;->dispose()V

    .line 283
    return-object v14

    .line 252
    .restart local v2    # "colCount":I
    .restart local v8    # "key":Ljava/lang/String;
    .restart local v12    # "row":Lorg/json/JSONObject;
    .restart local v13    # "rowsArrayResult":Lorg/json/JSONArray;
    :pswitch_2
    :try_start_5
    invoke-interface {v9, v7}, Lio/liteglue/SQLiteStatement;->getColumnDouble(I)D

    move-result-wide v16

    move-wide/from16 v0, v16

    invoke-virtual {v12, v8, v0, v1}, Lorg/json/JSONObject;->put(Ljava/lang/String;D)Lorg/json/JSONObject;

    goto :goto_3

    .line 256
    :pswitch_3
    invoke-interface {v9, v7}, Lio/liteglue/SQLiteStatement;->getColumnLong(I)J

    move-result-wide v16

    move-wide/from16 v0, v16

    invoke-virtual {v12, v8, v0, v1}, Lorg/json/JSONObject;->put(Ljava/lang/String;J)Lorg/json/JSONObject;

    goto :goto_3

    .line 267
    :cond_7
    invoke-virtual {v13, v12}, Lorg/json/JSONArray;->put(Ljava/lang/Object;)Lorg/json/JSONArray;
    :try_end_5
    .catch Lorg/json/JSONException; {:try_start_5 .. :try_end_5} :catch_2

    goto :goto_4

    .line 276
    :catch_3
    move-exception v3

    .line 277
    .restart local v3    # "e":Lorg/json/JSONException;
    invoke-virtual {v3}, Lorg/json/JSONException;->printStackTrace()V

    goto :goto_5

    .line 246
    nop

    :pswitch_data_0
    .packed-switch 0x1
        :pswitch_3
        :pswitch_2
        :pswitch_0
        :pswitch_0
        :pswitch_1
    .end packed-switch
.end method


# virtual methods
.method bugWorkaround()V
    .locals 0

    .prologue
    .line 78
    return-void
.end method

.method closeDatabaseNow()V
    .locals 3

    .prologue
    .line 67
    :try_start_0
    iget-object v1, p0, Lio/sqlc/SQLiteConnectorDatabase;->mydb:Lio/liteglue/SQLiteConnection;

    if-eqz v1, :cond_0

    .line 68
    iget-object v1, p0, Lio/sqlc/SQLiteConnectorDatabase;->mydb:Lio/liteglue/SQLiteConnection;

    invoke-interface {v1}, Lio/liteglue/SQLiteConnection;->dispose()V
    :try_end_0
    .catch Ljava/lang/Exception; {:try_start_0 .. :try_end_0} :catch_0

    .line 72
    :cond_0
    :goto_0
    return-void

    .line 69
    :catch_0
    move-exception v0

    .line 70
    .local v0, "e":Ljava/lang/Exception;
    const-class v1, Lio/sqlc/SQLitePlugin;

    invoke-virtual {v1}, Ljava/lang/Class;->getSimpleName()Ljava/lang/String;

    move-result-object v1

    const-string v2, "couldn\'t close database, ignoring"

    invoke-static {v1, v2, v0}, Landroid/util/Log;->e(Ljava/lang/String;Ljava/lang/String;Ljava/lang/Throwable;)I

    goto :goto_0
.end method

.method executeSqlBatch([Ljava/lang/String;[Lorg/json/JSONArray;Lorg/apache/cordova/CallbackContext;)V
    .locals 28
    .param p1, "queryarr"    # [Ljava/lang/String;
    .param p2, "jsonparams"    # [Lorg/json/JSONArray;
    .param p3, "cbc"    # Lorg/apache/cordova/CallbackContext;

    .prologue
    .line 91
    move-object/from16 v0, p0

    iget-object v0, v0, Lio/sqlc/SQLiteConnectorDatabase;->mydb:Lio/liteglue/SQLiteConnection;

    move-object/from16 v25, v0

    if-nez v25, :cond_0

    .line 93
    const-string v25, "database has been closed"

    move-object/from16 v0, p3

    move-object/from16 v1, v25

    invoke-virtual {v0, v1}, Lorg/apache/cordova/CallbackContext;->error(Ljava/lang/String;)V

    .line 179
    :goto_0
    return-void

    .line 97
    :cond_0
    move-object/from16 v0, p1

    array-length v14, v0

    .line 98
    .local v14, "len":I
    new-instance v4, Lorg/json/JSONArray;

    invoke-direct {v4}, Lorg/json/JSONArray;-><init>()V

    .line 100
    .local v4, "batchResults":Lorg/json/JSONArray;
    const/4 v9, 0x0

    .local v9, "i":I
    :goto_1
    if-ge v9, v14, :cond_3

    .line 101
    const/16 v21, 0x0

    .line 102
    .local v21, "rowsAffectedCompat":I
    const/4 v15, 0x0

    .line 104
    .local v15, "needRowsAffectedCompat":Z
    const/16 v19, 0x0

    .line 106
    .local v19, "queryResult":Lorg/json/JSONObject;
    const-string v7, "unknown"

    .line 107
    .local v7, "errorMessage":Ljava/lang/String;
    const/16 v24, -0x1

    .line 108
    .local v24, "sqliteErrorCode":I
    const/4 v5, 0x0

    .line 111
    .local v5, "code":I
    :try_start_0
    aget-object v18, p1, v9

    .line 113
    .local v18, "query":Ljava/lang/String;
    move-object/from16 v0, p0

    iget-object v0, v0, Lio/sqlc/SQLiteConnectorDatabase;->mydb:Lio/liteglue/SQLiteConnection;

    move-object/from16 v25, v0

    invoke-interface/range {v25 .. v25}, Lio/liteglue/SQLiteConnection;->getTotalChanges()I

    move-result v25

    move/from16 v0, v25

    int-to-long v12, v0

    .line 114
    .local v12, "lastTotal":J
    aget-object v25, p2, v9

    move-object/from16 v0, p0

    move-object/from16 v1, v18

    move-object/from16 v2, v25

    move-object/from16 v3, p3

    invoke-direct {v0, v1, v2, v3}, Lio/sqlc/SQLiteConnectorDatabase;->executeSQLiteStatement(Ljava/lang/String;Lorg/json/JSONArray;Lorg/apache/cordova/CallbackContext;)Lorg/json/JSONObject;

    move-result-object v19

    .line 115
    move-object/from16 v0, p0

    iget-object v0, v0, Lio/sqlc/SQLiteConnectorDatabase;->mydb:Lio/liteglue/SQLiteConnection;

    move-object/from16 v25, v0

    invoke-interface/range {v25 .. v25}, Lio/liteglue/SQLiteConnection;->getTotalChanges()I

    move-result v25

    move/from16 v0, v25

    int-to-long v0, v0

    move-wide/from16 v16, v0

    .line 116
    .local v16, "newTotal":J
    sub-long v22, v16, v12

    .line 118
    .local v22, "rowsAffected":J
    const-string v25, "rowsAffected"

    move-object/from16 v0, v19

    move-object/from16 v1, v25

    move-wide/from16 v2, v22

    invoke-virtual {v0, v1, v2, v3}, Lorg/json/JSONObject;->put(Ljava/lang/String;J)Lorg/json/JSONObject;

    .line 119
    const-wide/16 v26, 0x0

    cmp-long v25, v22, v26

    if-lez v25, :cond_1

    .line 120
    move-object/from16 v0, p0

    iget-object v0, v0, Lio/sqlc/SQLiteConnectorDatabase;->mydb:Lio/liteglue/SQLiteConnection;

    move-object/from16 v25, v0

    invoke-interface/range {v25 .. v25}, Lio/liteglue/SQLiteConnection;->getLastInsertRowid()J

    move-result-wide v10

    .line 121
    .local v10, "insertId":J
    const-wide/16 v26, 0x0

    cmp-long v25, v10, v26

    if-lez v25, :cond_1

    .line 122
    const-string v25, "insertId"

    move-object/from16 v0, v19

    move-object/from16 v1, v25

    invoke-virtual {v0, v1, v10, v11}, Lorg/json/JSONObject;->put(Ljava/lang/String;J)Lorg/json/JSONObject;
    :try_end_0
    .catch Ljava/sql/SQLException; {:try_start_0 .. :try_end_0} :catch_0
    .catch Lorg/json/JSONException; {:try_start_0 .. :try_end_0} :catch_1

    .line 153
    .end local v10    # "insertId":J
    .end local v12    # "lastTotal":J
    .end local v16    # "newTotal":J
    .end local v18    # "query":Ljava/lang/String;
    .end local v22    # "rowsAffected":J
    :cond_1
    :goto_2
    if-eqz v19, :cond_2

    .line 154
    :try_start_1
    new-instance v20, Lorg/json/JSONObject;

    invoke-direct/range {v20 .. v20}, Lorg/json/JSONObject;-><init>()V

    .line 156
    .local v20, "r":Lorg/json/JSONObject;
    const-string v25, "type"

    const-string v26, "success"

    move-object/from16 v0, v20

    move-object/from16 v1, v25

    move-object/from16 v2, v26

    invoke-virtual {v0, v1, v2}, Lorg/json/JSONObject;->put(Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    .line 157
    const-string v25, "result"

    move-object/from16 v0, v20

    move-object/from16 v1, v25

    move-object/from16 v2, v19

    invoke-virtual {v0, v1, v2}, Lorg/json/JSONObject;->put(Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    .line 159
    move-object/from16 v0, v20

    invoke-virtual {v4, v0}, Lorg/json/JSONArray;->put(Ljava/lang/Object;)Lorg/json/JSONArray;
    :try_end_1
    .catch Lorg/json/JSONException; {:try_start_1 .. :try_end_1} :catch_2

    .line 100
    .end local v20    # "r":Lorg/json/JSONObject;
    :goto_3
    add-int/lit8 v9, v9, 0x1

    goto/16 :goto_1

    .line 125
    :catch_0
    move-exception v8

    .line 126
    .local v8, "ex":Ljava/sql/SQLException;
    invoke-virtual {v8}, Ljava/sql/SQLException;->printStackTrace()V

    .line 127
    invoke-virtual {v8}, Ljava/sql/SQLException;->getErrorCode()I

    move-result v24

    .line 128
    invoke-virtual {v8}, Ljava/sql/SQLException;->getMessage()Ljava/lang/String;

    move-result-object v7

    .line 129
    const-string v25, "executeSqlBatch"

    new-instance v26, Ljava/lang/StringBuilder;

    invoke-direct/range {v26 .. v26}, Ljava/lang/StringBuilder;-><init>()V

    const-string v27, "SQLitePlugin.executeSql[Batch](): SQL Error code = "

    invoke-virtual/range {v26 .. v27}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v26

    move-object/from16 v0, v26

    move/from16 v1, v24

    invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v26

    const-string v27, " message = "

    invoke-virtual/range {v26 .. v27}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v26

    move-object/from16 v0, v26

    invoke-virtual {v0, v7}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v26

    invoke-virtual/range {v26 .. v26}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v26

    invoke-static/range {v25 .. v26}, Landroid/util/Log;->v(Ljava/lang/String;Ljava/lang/String;)I

    .line 131
    sparse-switch v24, :sswitch_data_0

    goto :goto_2

    .line 133
    :sswitch_0
    const/4 v5, 0x5

    .line 134
    goto :goto_2

    .line 136
    :sswitch_1
    const/4 v5, 0x4

    .line 137
    goto :goto_2

    .line 139
    :sswitch_2
    const/4 v5, 0x6

    .line 140
    goto :goto_2

    .line 144
    .end local v8    # "ex":Ljava/sql/SQLException;
    :catch_1
    move-exception v8

    .line 146
    .local v8, "ex":Lorg/json/JSONException;
    invoke-virtual {v8}, Lorg/json/JSONException;->printStackTrace()V

    .line 147
    invoke-virtual {v8}, Lorg/json/JSONException;->getMessage()Ljava/lang/String;

    move-result-object v7

    .line 148
    const/4 v5, 0x0

    .line 149
    const-string v25, "executeSqlBatch"

    new-instance v26, Ljava/lang/StringBuilder;

    invoke-direct/range {v26 .. v26}, Ljava/lang/StringBuilder;-><init>()V

    const-string v27, "SQLitePlugin.executeSql[Batch](): UNEXPECTED JSON Error="

    invoke-virtual/range {v26 .. v27}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v26

    move-object/from16 v0, v26

    invoke-virtual {v0, v7}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v26

    invoke-virtual/range {v26 .. v26}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v26

    invoke-static/range {v25 .. v26}, Landroid/util/Log;->e(Ljava/lang/String;Ljava/lang/String;)I

    goto/16 :goto_2

    .line 161
    .end local v8    # "ex":Lorg/json/JSONException;
    :cond_2
    :try_start_2
    new-instance v20, Lorg/json/JSONObject;

    invoke-direct/range {v20 .. v20}, Lorg/json/JSONObject;-><init>()V

    .line 162
    .restart local v20    # "r":Lorg/json/JSONObject;
    const-string v25, "type"

    const-string v26, "error"

    move-object/from16 v0, v20

    move-object/from16 v1, v25

    move-object/from16 v2, v26

    invoke-virtual {v0, v1, v2}, Lorg/json/JSONObject;->put(Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    .line 164
    new-instance v6, Lorg/json/JSONObject;

    invoke-direct {v6}, Lorg/json/JSONObject;-><init>()V

    .line 165
    .local v6, "er":Lorg/json/JSONObject;
    const-string v25, "message"

    move-object/from16 v0, v25

    invoke-virtual {v6, v0, v7}, Lorg/json/JSONObject;->put(Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    .line 166
    const-string v25, "code"

    move-object/from16 v0, v25

    invoke-virtual {v6, v0, v5}, Lorg/json/JSONObject;->put(Ljava/lang/String;I)Lorg/json/JSONObject;

    .line 167
    const-string v25, "result"

    move-object/from16 v0, v20

    move-object/from16 v1, v25

    invoke-virtual {v0, v1, v6}, Lorg/json/JSONObject;->put(Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    .line 169
    move-object/from16 v0, v20

    invoke-virtual {v4, v0}, Lorg/json/JSONArray;->put(Ljava/lang/Object;)Lorg/json/JSONArray;
    :try_end_2
    .catch Lorg/json/JSONException; {:try_start_2 .. :try_end_2} :catch_2

    goto/16 :goto_3

    .line 171
    .end local v6    # "er":Lorg/json/JSONObject;
    .end local v20    # "r":Lorg/json/JSONObject;
    :catch_2
    move-exception v8

    .line 172
    .restart local v8    # "ex":Lorg/json/JSONException;
    invoke-virtual {v8}, Lorg/json/JSONException;->printStackTrace()V

    .line 173
    const-string v25, "executeSqlBatch"

    new-instance v26, Ljava/lang/StringBuilder;

    invoke-direct/range {v26 .. v26}, Ljava/lang/StringBuilder;-><init>()V

    const-string v27, "SQLitePlugin.executeSql[Batch](): Error="

    invoke-virtual/range {v26 .. v27}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v26

    invoke-virtual {v8}, Lorg/json/JSONException;->getMessage()Ljava/lang/String;

    move-result-object v27

    invoke-virtual/range {v26 .. v27}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v26

    invoke-virtual/range {v26 .. v26}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v26

    invoke-static/range {v25 .. v26}, Landroid/util/Log;->e(Ljava/lang/String;Ljava/lang/String;)I

    goto/16 :goto_3

    .line 178
    .end local v5    # "code":I
    .end local v7    # "errorMessage":Ljava/lang/String;
    .end local v8    # "ex":Lorg/json/JSONException;
    .end local v15    # "needRowsAffectedCompat":Z
    .end local v19    # "queryResult":Lorg/json/JSONObject;
    .end local v21    # "rowsAffectedCompat":I
    .end local v24    # "sqliteErrorCode":I
    :cond_3
    move-object/from16 v0, p3

    invoke-virtual {v0, v4}, Lorg/apache/cordova/CallbackContext;->success(Lorg/json/JSONArray;)V

    goto/16 :goto_0

    .line 131
    :sswitch_data_0
    .sparse-switch
        0x1 -> :sswitch_0
        0xd -> :sswitch_1
        0x13 -> :sswitch_2
    .end sparse-switch
.end method

.method open(Ljava/io/File;)V
    .locals 3
    .param p1, "dbFile"    # Ljava/io/File;
    .annotation system Ldalvik/annotation/Throws;
        value = {
            Ljava/lang/Exception;
        }
    .end annotation

    .prologue
    .line 57
    sget-object v0, Lio/sqlc/SQLiteConnectorDatabase;->connector:Lio/liteglue/SQLiteConnector;

    invoke-virtual {p1}, Ljava/io/File;->getAbsolutePath()Ljava/lang/String;

    move-result-object v1

    const/4 v2, 0x6

    invoke-virtual {v0, v1, v2}, Lio/liteglue/SQLiteConnector;->newSQLiteConnection(Ljava/lang/String;I)Lio/liteglue/SQLiteConnection;

    move-result-object v0

    iput-object v0, p0, Lio/sqlc/SQLiteConnectorDatabase;->mydb:Lio/liteglue/SQLiteConnection;

    .line 59
    return-void
.end method
