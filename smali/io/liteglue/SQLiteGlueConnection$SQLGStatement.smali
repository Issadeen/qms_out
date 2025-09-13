.class Lio/liteglue/SQLiteGlueConnection$SQLGStatement;
.super Ljava/lang/Object;
.source "SQLiteGlueConnection.java"

# interfaces
.implements Lio/liteglue/SQLiteStatement;


# annotations
.annotation system Ldalvik/annotation/EnclosingClass;
    value = Lio/liteglue/SQLiteGlueConnection;
.end annotation

.annotation system Ldalvik/annotation/InnerClass;
    accessFlags = 0x2
    name = "SQLGStatement"
.end annotation


# instance fields
.field private columnCount:I

.field private hasRow:Z

.field private sql:Ljava/lang/String;

.field private sthandle:Lio/liteglue/SQLStatementHandle;

.field final synthetic this$0:Lio/liteglue/SQLiteGlueConnection;


# direct methods
.method constructor <init>(Lio/liteglue/SQLiteGlueConnection;Ljava/lang/String;)V
    .locals 2

    .prologue
    const/4 v1, 0x0

    const/4 v0, 0x0

    .line 70
    iput-object p1, p0, Lio/liteglue/SQLiteGlueConnection$SQLGStatement;->this$0:Lio/liteglue/SQLiteGlueConnection;

    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    .line 225
    iput-object v1, p0, Lio/liteglue/SQLiteGlueConnection$SQLGStatement;->sthandle:Lio/liteglue/SQLStatementHandle;

    .line 226
    iput-object v1, p0, Lio/liteglue/SQLiteGlueConnection$SQLGStatement;->sql:Ljava/lang/String;

    .line 227
    iput-boolean v0, p0, Lio/liteglue/SQLiteGlueConnection$SQLGStatement;->hasRow:Z

    .line 228
    iput v0, p0, Lio/liteglue/SQLiteGlueConnection$SQLGStatement;->columnCount:I

    .line 71
    iput-object p2, p0, Lio/liteglue/SQLiteGlueConnection$SQLGStatement;->sql:Ljava/lang/String;

    .line 72
    invoke-static {p1}, Lio/liteglue/SQLiteGlueConnection;->access$000(Lio/liteglue/SQLiteGlueConnection;)Lio/liteglue/SQLDatabaseHandle;

    move-result-object v0

    invoke-interface {v0, p2}, Lio/liteglue/SQLDatabaseHandle;->newStatementHandle(Ljava/lang/String;)Lio/liteglue/SQLStatementHandle;

    move-result-object v0

    iput-object v0, p0, Lio/liteglue/SQLiteGlueConnection$SQLGStatement;->sthandle:Lio/liteglue/SQLStatementHandle;

    .line 73
    return-void
.end method


# virtual methods
.method public bindDouble(ID)V
    .locals 4
    .annotation system Ldalvik/annotation/Throws;
        value = {
            Ljava/sql/SQLException;
        }
    .end annotation

    .prologue
    .line 83
    iget-object v0, p0, Lio/liteglue/SQLiteGlueConnection$SQLGStatement;->sthandle:Lio/liteglue/SQLStatementHandle;

    if-nez v0, :cond_0

    new-instance v0, Ljava/sql/SQLException;

    const-string v1, "already disposed"

    const-string v2, "failed"

    const/16 v3, 0x15

    invoke-direct {v0, v1, v2, v3}, Ljava/sql/SQLException;-><init>(Ljava/lang/String;Ljava/lang/String;I)V

    throw v0

    .line 85
    :cond_0
    iget-object v0, p0, Lio/liteglue/SQLiteGlueConnection$SQLGStatement;->sthandle:Lio/liteglue/SQLStatementHandle;

    invoke-interface {v0, p1, p2, p3}, Lio/liteglue/SQLStatementHandle;->bindDouble(ID)I

    move-result v0

    .line 86
    if-eqz v0, :cond_1

    new-instance v1, Ljava/sql/SQLException;

    new-instance v2, Ljava/lang/StringBuilder;

    invoke-direct {v2}, Ljava/lang/StringBuilder;-><init>()V

    const-string v3, "sqlite3_bind_double failure: "

    invoke-virtual {v2, v3}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v2

    iget-object v3, p0, Lio/liteglue/SQLiteGlueConnection$SQLGStatement;->this$0:Lio/liteglue/SQLiteGlueConnection;

    invoke-static {v3}, Lio/liteglue/SQLiteGlueConnection;->access$000(Lio/liteglue/SQLiteGlueConnection;)Lio/liteglue/SQLDatabaseHandle;

    move-result-object v3

    invoke-interface {v3}, Lio/liteglue/SQLDatabaseHandle;->getLastErrorMessage()Ljava/lang/String;

    move-result-object v3

    invoke-virtual {v2, v3}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v2

    invoke-virtual {v2}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v2

    const-string v3, "failure"

    invoke-direct {v1, v2, v3, v0}, Ljava/sql/SQLException;-><init>(Ljava/lang/String;Ljava/lang/String;I)V

    throw v1

    .line 87
    :cond_1
    return-void
.end method

.method public bindInteger(II)V
    .locals 4
    .annotation system Ldalvik/annotation/Throws;
        value = {
            Ljava/sql/SQLException;
        }
    .end annotation

    .prologue
    .line 92
    iget-object v0, p0, Lio/liteglue/SQLiteGlueConnection$SQLGStatement;->sthandle:Lio/liteglue/SQLStatementHandle;

    if-nez v0, :cond_0

    new-instance v0, Ljava/sql/SQLException;

    const-string v1, "already disposed"

    const-string v2, "failed"

    const/16 v3, 0x15

    invoke-direct {v0, v1, v2, v3}, Ljava/sql/SQLException;-><init>(Ljava/lang/String;Ljava/lang/String;I)V

    throw v0

    .line 94
    :cond_0
    iget-object v0, p0, Lio/liteglue/SQLiteGlueConnection$SQLGStatement;->sthandle:Lio/liteglue/SQLStatementHandle;

    invoke-interface {v0, p1, p2}, Lio/liteglue/SQLStatementHandle;->bindInteger(II)I

    move-result v0

    .line 95
    if-eqz v0, :cond_1

    new-instance v1, Ljava/sql/SQLException;

    new-instance v2, Ljava/lang/StringBuilder;

    invoke-direct {v2}, Ljava/lang/StringBuilder;-><init>()V

    const-string v3, "sqlite3_bind_int failure: "

    invoke-virtual {v2, v3}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v2

    iget-object v3, p0, Lio/liteglue/SQLiteGlueConnection$SQLGStatement;->this$0:Lio/liteglue/SQLiteGlueConnection;

    invoke-static {v3}, Lio/liteglue/SQLiteGlueConnection;->access$000(Lio/liteglue/SQLiteGlueConnection;)Lio/liteglue/SQLDatabaseHandle;

    move-result-object v3

    invoke-interface {v3}, Lio/liteglue/SQLDatabaseHandle;->getLastErrorMessage()Ljava/lang/String;

    move-result-object v3

    invoke-virtual {v2, v3}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v2

    invoke-virtual {v2}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v2

    const-string v3, "failure"

    invoke-direct {v1, v2, v3, v0}, Ljava/sql/SQLException;-><init>(Ljava/lang/String;Ljava/lang/String;I)V

    throw v1

    .line 96
    :cond_1
    return-void
.end method

.method public bindLong(IJ)V
    .locals 4
    .annotation system Ldalvik/annotation/Throws;
        value = {
            Ljava/sql/SQLException;
        }
    .end annotation

    .prologue
    .line 101
    iget-object v0, p0, Lio/liteglue/SQLiteGlueConnection$SQLGStatement;->sthandle:Lio/liteglue/SQLStatementHandle;

    if-nez v0, :cond_0

    new-instance v0, Ljava/sql/SQLException;

    const-string v1, "already disposed"

    const-string v2, "failed"

    const/16 v3, 0x15

    invoke-direct {v0, v1, v2, v3}, Ljava/sql/SQLException;-><init>(Ljava/lang/String;Ljava/lang/String;I)V

    throw v0

    .line 103
    :cond_0
    iget-object v0, p0, Lio/liteglue/SQLiteGlueConnection$SQLGStatement;->sthandle:Lio/liteglue/SQLStatementHandle;

    invoke-interface {v0, p1, p2, p3}, Lio/liteglue/SQLStatementHandle;->bindLong(IJ)I

    move-result v0

    .line 104
    if-eqz v0, :cond_1

    new-instance v1, Ljava/sql/SQLException;

    new-instance v2, Ljava/lang/StringBuilder;

    invoke-direct {v2}, Ljava/lang/StringBuilder;-><init>()V

    const-string v3, "sqlite3_bind_int64 (long) failure: "

    invoke-virtual {v2, v3}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v2

    iget-object v3, p0, Lio/liteglue/SQLiteGlueConnection$SQLGStatement;->this$0:Lio/liteglue/SQLiteGlueConnection;

    invoke-static {v3}, Lio/liteglue/SQLiteGlueConnection;->access$000(Lio/liteglue/SQLiteGlueConnection;)Lio/liteglue/SQLDatabaseHandle;

    move-result-object v3

    invoke-interface {v3}, Lio/liteglue/SQLDatabaseHandle;->getLastErrorMessage()Ljava/lang/String;

    move-result-object v3

    invoke-virtual {v2, v3}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v2

    invoke-virtual {v2}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v2

    const-string v3, "failure"

    invoke-direct {v1, v2, v3, v0}, Ljava/sql/SQLException;-><init>(Ljava/lang/String;Ljava/lang/String;I)V

    throw v1

    .line 105
    :cond_1
    return-void
.end method

.method public bindNull(I)V
    .locals 4
    .annotation system Ldalvik/annotation/Throws;
        value = {
            Ljava/sql/SQLException;
        }
    .end annotation

    .prologue
    .line 110
    iget-object v0, p0, Lio/liteglue/SQLiteGlueConnection$SQLGStatement;->sthandle:Lio/liteglue/SQLStatementHandle;

    if-nez v0, :cond_0

    new-instance v0, Ljava/sql/SQLException;

    const-string v1, "already disposed"

    const-string v2, "failed"

    const/16 v3, 0x15

    invoke-direct {v0, v1, v2, v3}, Ljava/sql/SQLException;-><init>(Ljava/lang/String;Ljava/lang/String;I)V

    throw v0

    .line 112
    :cond_0
    iget-object v0, p0, Lio/liteglue/SQLiteGlueConnection$SQLGStatement;->sthandle:Lio/liteglue/SQLStatementHandle;

    invoke-interface {v0, p1}, Lio/liteglue/SQLStatementHandle;->bindNull(I)I

    move-result v0

    .line 113
    if-eqz v0, :cond_1

    new-instance v1, Ljava/sql/SQLException;

    new-instance v2, Ljava/lang/StringBuilder;

    invoke-direct {v2}, Ljava/lang/StringBuilder;-><init>()V

    const-string v3, "sqlite3_bind_null failure: "

    invoke-virtual {v2, v3}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v2

    iget-object v3, p0, Lio/liteglue/SQLiteGlueConnection$SQLGStatement;->this$0:Lio/liteglue/SQLiteGlueConnection;

    invoke-static {v3}, Lio/liteglue/SQLiteGlueConnection;->access$000(Lio/liteglue/SQLiteGlueConnection;)Lio/liteglue/SQLDatabaseHandle;

    move-result-object v3

    invoke-interface {v3}, Lio/liteglue/SQLDatabaseHandle;->getLastErrorMessage()Ljava/lang/String;

    move-result-object v3

    invoke-virtual {v2, v3}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v2

    invoke-virtual {v2}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v2

    const-string v3, "failure"

    invoke-direct {v1, v2, v3, v0}, Ljava/sql/SQLException;-><init>(Ljava/lang/String;Ljava/lang/String;I)V

    throw v1

    .line 114
    :cond_1
    return-void
.end method

.method public bindTextNativeString(ILjava/lang/String;)V
    .locals 4
    .annotation system Ldalvik/annotation/Throws;
        value = {
            Ljava/sql/SQLException;
        }
    .end annotation

    .prologue
    const/16 v3, 0x15

    .line 119
    iget-object v0, p0, Lio/liteglue/SQLiteGlueConnection$SQLGStatement;->sthandle:Lio/liteglue/SQLStatementHandle;

    if-nez v0, :cond_0

    new-instance v0, Ljava/sql/SQLException;

    const-string v1, "already disposed"

    const-string v2, "failed"

    invoke-direct {v0, v1, v2, v3}, Ljava/sql/SQLException;-><init>(Ljava/lang/String;Ljava/lang/String;I)V

    throw v0

    .line 122
    :cond_0
    if-nez p2, :cond_1

    new-instance v0, Ljava/sql/SQLException;

    const-string v1, "null argument"

    const-string v2, "failed"

    invoke-direct {v0, v1, v2, v3}, Ljava/sql/SQLException;-><init>(Ljava/lang/String;Ljava/lang/String;I)V

    throw v0

    .line 124
    :cond_1
    iget-object v0, p0, Lio/liteglue/SQLiteGlueConnection$SQLGStatement;->sthandle:Lio/liteglue/SQLStatementHandle;

    invoke-interface {v0, p1, p2}, Lio/liteglue/SQLStatementHandle;->bindTextNativeString(ILjava/lang/String;)I

    move-result v0

    .line 125
    if-eqz v0, :cond_2

    new-instance v1, Ljava/sql/SQLException;

    new-instance v2, Ljava/lang/StringBuilder;

    invoke-direct {v2}, Ljava/lang/StringBuilder;-><init>()V

    const-string v3, "sqlite3_bind_text failure: "

    invoke-virtual {v2, v3}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v2

    iget-object v3, p0, Lio/liteglue/SQLiteGlueConnection$SQLGStatement;->this$0:Lio/liteglue/SQLiteGlueConnection;

    invoke-static {v3}, Lio/liteglue/SQLiteGlueConnection;->access$000(Lio/liteglue/SQLiteGlueConnection;)Lio/liteglue/SQLDatabaseHandle;

    move-result-object v3

    invoke-interface {v3}, Lio/liteglue/SQLDatabaseHandle;->getLastErrorMessage()Ljava/lang/String;

    move-result-object v3

    invoke-virtual {v2, v3}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v2

    invoke-virtual {v2}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v2

    const-string v3, "failure"

    invoke-direct {v1, v2, v3, v0}, Ljava/sql/SQLException;-><init>(Ljava/lang/String;Ljava/lang/String;I)V

    throw v1

    .line 126
    :cond_2
    return-void
.end method

.method public dispose()V
    .locals 4
    .annotation system Ldalvik/annotation/Throws;
        value = {
            Ljava/sql/SQLException;
        }
    .end annotation

    .prologue
    .line 218
    iget-object v0, p0, Lio/liteglue/SQLiteGlueConnection$SQLGStatement;->sthandle:Lio/liteglue/SQLStatementHandle;

    if-nez v0, :cond_0

    new-instance v0, Ljava/sql/SQLException;

    const-string v1, "already disposed"

    const-string v2, "failed"

    const/16 v3, 0x15

    invoke-direct {v0, v1, v2, v3}, Ljava/sql/SQLException;-><init>(Ljava/lang/String;Ljava/lang/String;I)V

    throw v0

    .line 221
    :cond_0
    iget-object v0, p0, Lio/liteglue/SQLiteGlueConnection$SQLGStatement;->sthandle:Lio/liteglue/SQLStatementHandle;

    invoke-interface {v0}, Lio/liteglue/SQLStatementHandle;->finish()I

    .line 222
    const/4 v0, 0x0

    iput-object v0, p0, Lio/liteglue/SQLiteGlueConnection$SQLGStatement;->sthandle:Lio/liteglue/SQLStatementHandle;

    .line 223
    return-void
.end method

.method public getColumnCount()I
    .locals 4
    .annotation system Ldalvik/annotation/Throws;
        value = {
            Ljava/sql/SQLException;
        }
    .end annotation

    .prologue
    const/16 v3, 0x15

    .line 149
    iget-object v0, p0, Lio/liteglue/SQLiteGlueConnection$SQLGStatement;->sthandle:Lio/liteglue/SQLStatementHandle;

    if-nez v0, :cond_0

    new-instance v0, Ljava/sql/SQLException;

    const-string v1, "already disposed"

    const-string v2, "failed"

    invoke-direct {v0, v1, v2, v3}, Ljava/sql/SQLException;-><init>(Ljava/lang/String;Ljava/lang/String;I)V

    throw v0

    .line 150
    :cond_0
    iget-boolean v0, p0, Lio/liteglue/SQLiteGlueConnection$SQLGStatement;->hasRow:Z

    if-nez v0, :cond_1

    new-instance v0, Ljava/sql/SQLException;

    const-string v1, "no result available"

    const-string v2, "failed"

    invoke-direct {v0, v1, v2, v3}, Ljava/sql/SQLException;-><init>(Ljava/lang/String;Ljava/lang/String;I)V

    throw v0

    .line 152
    :cond_1
    iget v0, p0, Lio/liteglue/SQLiteGlueConnection$SQLGStatement;->columnCount:I

    return v0
.end method

.method public getColumnDouble(I)D
    .locals 4
    .annotation system Ldalvik/annotation/Throws;
        value = {
            Ljava/sql/SQLException;
        }
    .end annotation

    .prologue
    const/16 v3, 0x15

    .line 178
    iget-object v0, p0, Lio/liteglue/SQLiteGlueConnection$SQLGStatement;->sthandle:Lio/liteglue/SQLStatementHandle;

    if-nez v0, :cond_0

    new-instance v0, Ljava/sql/SQLException;

    const-string v1, "already disposed"

    const-string v2, "failed"

    invoke-direct {v0, v1, v2, v3}, Ljava/sql/SQLException;-><init>(Ljava/lang/String;Ljava/lang/String;I)V

    throw v0

    .line 179
    :cond_0
    iget-boolean v0, p0, Lio/liteglue/SQLiteGlueConnection$SQLGStatement;->hasRow:Z

    if-nez v0, :cond_1

    new-instance v0, Ljava/sql/SQLException;

    const-string v1, "no result available"

    const-string v2, "failed"

    invoke-direct {v0, v1, v2, v3}, Ljava/sql/SQLException;-><init>(Ljava/lang/String;Ljava/lang/String;I)V

    throw v0

    .line 180
    :cond_1
    if-ltz p1, :cond_2

    iget v0, p0, Lio/liteglue/SQLiteGlueConnection$SQLGStatement;->columnCount:I

    if-lt p1, v0, :cond_3

    :cond_2
    new-instance v0, Ljava/sql/SQLException;

    const-string v1, "no result available"

    const-string v2, "failed"

    invoke-direct {v0, v1, v2, v3}, Ljava/sql/SQLException;-><init>(Ljava/lang/String;Ljava/lang/String;I)V

    throw v0

    .line 182
    :cond_3
    iget-object v0, p0, Lio/liteglue/SQLiteGlueConnection$SQLGStatement;->sthandle:Lio/liteglue/SQLStatementHandle;

    invoke-interface {v0, p1}, Lio/liteglue/SQLStatementHandle;->getColumnDouble(I)D

    move-result-wide v0

    return-wide v0
.end method

.method public getColumnInteger(I)I
    .locals 4
    .annotation system Ldalvik/annotation/Throws;
        value = {
            Ljava/sql/SQLException;
        }
    .end annotation

    .prologue
    const/16 v3, 0x15

    .line 188
    iget-object v0, p0, Lio/liteglue/SQLiteGlueConnection$SQLGStatement;->sthandle:Lio/liteglue/SQLStatementHandle;

    if-nez v0, :cond_0

    new-instance v0, Ljava/sql/SQLException;

    const-string v1, "already disposed"

    const-string v2, "failed"

    invoke-direct {v0, v1, v2, v3}, Ljava/sql/SQLException;-><init>(Ljava/lang/String;Ljava/lang/String;I)V

    throw v0

    .line 189
    :cond_0
    iget-boolean v0, p0, Lio/liteglue/SQLiteGlueConnection$SQLGStatement;->hasRow:Z

    if-nez v0, :cond_1

    new-instance v0, Ljava/sql/SQLException;

    const-string v1, "no result available"

    const-string v2, "failed"

    invoke-direct {v0, v1, v2, v3}, Ljava/sql/SQLException;-><init>(Ljava/lang/String;Ljava/lang/String;I)V

    throw v0

    .line 190
    :cond_1
    if-ltz p1, :cond_2

    iget v0, p0, Lio/liteglue/SQLiteGlueConnection$SQLGStatement;->columnCount:I

    if-lt p1, v0, :cond_3

    :cond_2
    new-instance v0, Ljava/sql/SQLException;

    const-string v1, "no result available"

    const-string v2, "failed"

    invoke-direct {v0, v1, v2, v3}, Ljava/sql/SQLException;-><init>(Ljava/lang/String;Ljava/lang/String;I)V

    throw v0

    .line 192
    :cond_3
    iget-object v0, p0, Lio/liteglue/SQLiteGlueConnection$SQLGStatement;->sthandle:Lio/liteglue/SQLStatementHandle;

    invoke-interface {v0, p1}, Lio/liteglue/SQLStatementHandle;->getColumnInteger(I)I

    move-result v0

    return v0
.end method

.method public getColumnLong(I)J
    .locals 4
    .annotation system Ldalvik/annotation/Throws;
        value = {
            Ljava/sql/SQLException;
        }
    .end annotation

    .prologue
    const/16 v3, 0x15

    .line 198
    iget-object v0, p0, Lio/liteglue/SQLiteGlueConnection$SQLGStatement;->sthandle:Lio/liteglue/SQLStatementHandle;

    if-nez v0, :cond_0

    new-instance v0, Ljava/sql/SQLException;

    const-string v1, "already disposed"

    const-string v2, "failed"

    invoke-direct {v0, v1, v2, v3}, Ljava/sql/SQLException;-><init>(Ljava/lang/String;Ljava/lang/String;I)V

    throw v0

    .line 199
    :cond_0
    iget-boolean v0, p0, Lio/liteglue/SQLiteGlueConnection$SQLGStatement;->hasRow:Z

    if-nez v0, :cond_1

    new-instance v0, Ljava/sql/SQLException;

    const-string v1, "no result available"

    const-string v2, "failed"

    invoke-direct {v0, v1, v2, v3}, Ljava/sql/SQLException;-><init>(Ljava/lang/String;Ljava/lang/String;I)V

    throw v0

    .line 200
    :cond_1
    if-ltz p1, :cond_2

    iget v0, p0, Lio/liteglue/SQLiteGlueConnection$SQLGStatement;->columnCount:I

    if-lt p1, v0, :cond_3

    :cond_2
    new-instance v0, Ljava/sql/SQLException;

    const-string v1, "no result available"

    const-string v2, "failed"

    invoke-direct {v0, v1, v2, v3}, Ljava/sql/SQLException;-><init>(Ljava/lang/String;Ljava/lang/String;I)V

    throw v0

    .line 202
    :cond_3
    iget-object v0, p0, Lio/liteglue/SQLiteGlueConnection$SQLGStatement;->sthandle:Lio/liteglue/SQLStatementHandle;

    invoke-interface {v0, p1}, Lio/liteglue/SQLStatementHandle;->getColumnLong(I)J

    move-result-wide v0

    return-wide v0
.end method

.method public getColumnName(I)Ljava/lang/String;
    .locals 4
    .annotation system Ldalvik/annotation/Throws;
        value = {
            Ljava/sql/SQLException;
        }
    .end annotation

    .prologue
    const/16 v3, 0x15

    .line 158
    iget-object v0, p0, Lio/liteglue/SQLiteGlueConnection$SQLGStatement;->sthandle:Lio/liteglue/SQLStatementHandle;

    if-nez v0, :cond_0

    new-instance v0, Ljava/sql/SQLException;

    const-string v1, "already disposed"

    const-string v2, "failed"

    invoke-direct {v0, v1, v2, v3}, Ljava/sql/SQLException;-><init>(Ljava/lang/String;Ljava/lang/String;I)V

    throw v0

    .line 159
    :cond_0
    iget-boolean v0, p0, Lio/liteglue/SQLiteGlueConnection$SQLGStatement;->hasRow:Z

    if-nez v0, :cond_1

    new-instance v0, Ljava/sql/SQLException;

    const-string v1, "no result available"

    const-string v2, "failed"

    invoke-direct {v0, v1, v2, v3}, Ljava/sql/SQLException;-><init>(Ljava/lang/String;Ljava/lang/String;I)V

    throw v0

    .line 160
    :cond_1
    if-ltz p1, :cond_2

    iget v0, p0, Lio/liteglue/SQLiteGlueConnection$SQLGStatement;->columnCount:I

    if-lt p1, v0, :cond_3

    :cond_2
    new-instance v0, Ljava/sql/SQLException;

    const-string v1, "no result available"

    const-string v2, "failed"

    invoke-direct {v0, v1, v2, v3}, Ljava/sql/SQLException;-><init>(Ljava/lang/String;Ljava/lang/String;I)V

    throw v0

    .line 162
    :cond_3
    iget-object v0, p0, Lio/liteglue/SQLiteGlueConnection$SQLGStatement;->sthandle:Lio/liteglue/SQLStatementHandle;

    invoke-interface {v0, p1}, Lio/liteglue/SQLStatementHandle;->getColumnName(I)Ljava/lang/String;

    move-result-object v0

    return-object v0
.end method

.method public getColumnTextNativeString(I)Ljava/lang/String;
    .locals 4
    .annotation system Ldalvik/annotation/Throws;
        value = {
            Ljava/sql/SQLException;
        }
    .end annotation

    .prologue
    const/16 v3, 0x15

    .line 208
    iget-object v0, p0, Lio/liteglue/SQLiteGlueConnection$SQLGStatement;->sthandle:Lio/liteglue/SQLStatementHandle;

    if-nez v0, :cond_0

    new-instance v0, Ljava/sql/SQLException;

    const-string v1, "already disposed"

    const-string v2, "failed"

    invoke-direct {v0, v1, v2, v3}, Ljava/sql/SQLException;-><init>(Ljava/lang/String;Ljava/lang/String;I)V

    throw v0

    .line 209
    :cond_0
    iget-boolean v0, p0, Lio/liteglue/SQLiteGlueConnection$SQLGStatement;->hasRow:Z

    if-nez v0, :cond_1

    new-instance v0, Ljava/sql/SQLException;

    const-string v1, "no result available"

    const-string v2, "failed"

    invoke-direct {v0, v1, v2, v3}, Ljava/sql/SQLException;-><init>(Ljava/lang/String;Ljava/lang/String;I)V

    throw v0

    .line 210
    :cond_1
    if-ltz p1, :cond_2

    iget v0, p0, Lio/liteglue/SQLiteGlueConnection$SQLGStatement;->columnCount:I

    if-lt p1, v0, :cond_3

    :cond_2
    new-instance v0, Ljava/sql/SQLException;

    const-string v1, "no result available"

    const-string v2, "failed"

    invoke-direct {v0, v1, v2, v3}, Ljava/sql/SQLException;-><init>(Ljava/lang/String;Ljava/lang/String;I)V

    throw v0

    .line 212
    :cond_3
    iget-object v0, p0, Lio/liteglue/SQLiteGlueConnection$SQLGStatement;->sthandle:Lio/liteglue/SQLStatementHandle;

    invoke-interface {v0, p1}, Lio/liteglue/SQLStatementHandle;->getColumnTextNativeString(I)Ljava/lang/String;

    move-result-object v0

    return-object v0
.end method

.method public getColumnType(I)I
    .locals 4
    .annotation system Ldalvik/annotation/Throws;
        value = {
            Ljava/sql/SQLException;
        }
    .end annotation

    .prologue
    const/16 v3, 0x15

    .line 168
    iget-object v0, p0, Lio/liteglue/SQLiteGlueConnection$SQLGStatement;->sthandle:Lio/liteglue/SQLStatementHandle;

    if-nez v0, :cond_0

    new-instance v0, Ljava/sql/SQLException;

    const-string v1, "already disposed"

    const-string v2, "failed"

    invoke-direct {v0, v1, v2, v3}, Ljava/sql/SQLException;-><init>(Ljava/lang/String;Ljava/lang/String;I)V

    throw v0

    .line 169
    :cond_0
    iget-boolean v0, p0, Lio/liteglue/SQLiteGlueConnection$SQLGStatement;->hasRow:Z

    if-nez v0, :cond_1

    new-instance v0, Ljava/sql/SQLException;

    const-string v1, "no result available"

    const-string v2, "failed"

    invoke-direct {v0, v1, v2, v3}, Ljava/sql/SQLException;-><init>(Ljava/lang/String;Ljava/lang/String;I)V

    throw v0

    .line 170
    :cond_1
    if-ltz p1, :cond_2

    iget v0, p0, Lio/liteglue/SQLiteGlueConnection$SQLGStatement;->columnCount:I

    if-lt p1, v0, :cond_3

    :cond_2
    new-instance v0, Ljava/sql/SQLException;

    const-string v1, "no result available"

    const-string v2, "failed"

    invoke-direct {v0, v1, v2, v3}, Ljava/sql/SQLException;-><init>(Ljava/lang/String;Ljava/lang/String;I)V

    throw v0

    .line 172
    :cond_3
    iget-object v0, p0, Lio/liteglue/SQLiteGlueConnection$SQLGStatement;->sthandle:Lio/liteglue/SQLStatementHandle;

    invoke-interface {v0, p1}, Lio/liteglue/SQLStatementHandle;->getColumnType(I)I

    move-result v0

    return v0
.end method

.method prepare()I
    .locals 1

    .prologue
    .line 77
    iget-object v0, p0, Lio/liteglue/SQLiteGlueConnection$SQLGStatement;->sthandle:Lio/liteglue/SQLStatementHandle;

    invoke-interface {v0}, Lio/liteglue/SQLStatementHandle;->prepare()I

    move-result v0

    return v0
.end method

.method public step()Z
    .locals 4
    .annotation system Ldalvik/annotation/Throws;
        value = {
            Ljava/sql/SQLException;
        }
    .end annotation

    .prologue
    const/16 v3, 0x64

    const/4 v1, 0x0

    .line 131
    iget-object v0, p0, Lio/liteglue/SQLiteGlueConnection$SQLGStatement;->sthandle:Lio/liteglue/SQLStatementHandle;

    if-nez v0, :cond_0

    new-instance v0, Ljava/sql/SQLException;

    const-string v1, "already disposed"

    const-string v2, "failed"

    const/16 v3, 0x15

    invoke-direct {v0, v1, v2, v3}, Ljava/sql/SQLException;-><init>(Ljava/lang/String;Ljava/lang/String;I)V

    throw v0

    .line 133
    :cond_0
    iget-object v0, p0, Lio/liteglue/SQLiteGlueConnection$SQLGStatement;->sthandle:Lio/liteglue/SQLStatementHandle;

    invoke-interface {v0}, Lio/liteglue/SQLStatementHandle;->step()I

    move-result v0

    .line 134
    if-eqz v0, :cond_1

    if-eq v0, v3, :cond_1

    const/16 v2, 0x65

    if-eq v0, v2, :cond_1

    .line 135
    new-instance v1, Ljava/sql/SQLException;

    new-instance v2, Ljava/lang/StringBuilder;

    invoke-direct {v2}, Ljava/lang/StringBuilder;-><init>()V

    const-string v3, "sqlite3_step failure: "

    invoke-virtual {v2, v3}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v2

    iget-object v3, p0, Lio/liteglue/SQLiteGlueConnection$SQLGStatement;->this$0:Lio/liteglue/SQLiteGlueConnection;

    invoke-static {v3}, Lio/liteglue/SQLiteGlueConnection;->access$000(Lio/liteglue/SQLiteGlueConnection;)Lio/liteglue/SQLDatabaseHandle;

    move-result-object v3

    invoke-interface {v3}, Lio/liteglue/SQLDatabaseHandle;->getLastErrorMessage()Ljava/lang/String;

    move-result-object v3

    invoke-virtual {v2, v3}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v2

    invoke-virtual {v2}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v2

    const-string v3, "failure"

    invoke-direct {v1, v2, v3, v0}, Ljava/sql/SQLException;-><init>(Ljava/lang/String;Ljava/lang/String;I)V

    throw v1

    .line 138
    :cond_1
    if-ne v0, v3, :cond_2

    const/4 v0, 0x1

    :goto_0
    iput-boolean v0, p0, Lio/liteglue/SQLiteGlueConnection$SQLGStatement;->hasRow:Z

    .line 139
    iget-boolean v0, p0, Lio/liteglue/SQLiteGlueConnection$SQLGStatement;->hasRow:Z

    if-eqz v0, :cond_3

    .line 140
    iget-object v0, p0, Lio/liteglue/SQLiteGlueConnection$SQLGStatement;->sthandle:Lio/liteglue/SQLStatementHandle;

    invoke-interface {v0}, Lio/liteglue/SQLStatementHandle;->getColumnCount()I

    move-result v0

    iput v0, p0, Lio/liteglue/SQLiteGlueConnection$SQLGStatement;->columnCount:I

    .line 143
    :goto_1
    iget-boolean v0, p0, Lio/liteglue/SQLiteGlueConnection$SQLGStatement;->hasRow:Z

    return v0

    :cond_2
    move v0, v1

    .line 138
    goto :goto_0

    .line 141
    :cond_3
    iput v1, p0, Lio/liteglue/SQLiteGlueConnection$SQLGStatement;->columnCount:I

    goto :goto_1
.end method
