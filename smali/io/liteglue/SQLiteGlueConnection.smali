.class Lio/liteglue/SQLiteGlueConnection;
.super Ljava/lang/Object;
.source "SQLiteGlueConnection.java"

# interfaces
.implements Lio/liteglue/SQLiteConnection;


# annotations
.annotation system Ldalvik/annotation/MemberClasses;
    value = {
        Lio/liteglue/SQLiteGlueConnection$SQLGStatement;
    }
.end annotation


# instance fields
.field private db:Lio/liteglue/SQLDatabaseHandle;


# direct methods
.method public constructor <init>(Ljava/lang/String;I)V
    .locals 4
    .annotation system Ldalvik/annotation/Throws;
        value = {
            Ljava/sql/SQLException;
        }
    .end annotation

    .prologue
    .line 5
    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    .line 231
    const/4 v0, 0x0

    iput-object v0, p0, Lio/liteglue/SQLiteGlueConnection;->db:Lio/liteglue/SQLDatabaseHandle;

    .line 7
    if-nez p1, :cond_0

    new-instance v0, Ljava/sql/SQLException;

    const-string v1, "null argument"

    const-string v2, "failed"

    const/16 v3, 0x15

    invoke-direct {v0, v1, v2, v3}, Ljava/sql/SQLException;-><init>(Ljava/lang/String;Ljava/lang/String;I)V

    throw v0

    .line 9
    :cond_0
    new-instance v0, Lio/liteglue/SQLGDatabaseHandle;

    invoke-direct {v0, p1, p2}, Lio/liteglue/SQLGDatabaseHandle;-><init>(Ljava/lang/String;I)V

    .line 10
    invoke-interface {v0}, Lio/liteglue/SQLDatabaseHandle;->open()I

    move-result v1

    .line 12
    if-eqz v1, :cond_1

    new-instance v0, Ljava/sql/SQLException;

    new-instance v2, Ljava/lang/StringBuilder;

    invoke-direct {v2}, Ljava/lang/StringBuilder;-><init>()V

    const-string v3, "sqlite3_open_v2 failure: "

    invoke-virtual {v2, v3}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v2

    iget-object v3, p0, Lio/liteglue/SQLiteGlueConnection;->db:Lio/liteglue/SQLDatabaseHandle;

    invoke-interface {v3}, Lio/liteglue/SQLDatabaseHandle;->getLastErrorMessage()Ljava/lang/String;

    move-result-object v3

    invoke-virtual {v2, v3}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v2

    invoke-virtual {v2}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v2

    const-string v3, "failure"

    invoke-direct {v0, v2, v3, v1}, Ljava/sql/SQLException;-><init>(Ljava/lang/String;Ljava/lang/String;I)V

    throw v0

    .line 13
    :cond_1
    iput-object v0, p0, Lio/liteglue/SQLiteGlueConnection;->db:Lio/liteglue/SQLDatabaseHandle;

    .line 14
    return-void
.end method

.method static synthetic access$000(Lio/liteglue/SQLiteGlueConnection;)Lio/liteglue/SQLDatabaseHandle;
    .locals 1

    .prologue
    .line 3
    iget-object v0, p0, Lio/liteglue/SQLiteGlueConnection;->db:Lio/liteglue/SQLDatabaseHandle;

    return-object v0
.end method


# virtual methods
.method public dispose()V
    .locals 4
    .annotation system Ldalvik/annotation/Throws;
        value = {
            Ljava/sql/SQLException;
        }
    .end annotation

    .prologue
    .line 19
    iget-object v0, p0, Lio/liteglue/SQLiteGlueConnection;->db:Lio/liteglue/SQLDatabaseHandle;

    if-nez v0, :cond_0

    new-instance v0, Ljava/sql/SQLException;

    const-string v1, "already disposed"

    const-string v2, "failed"

    const/16 v3, 0x15

    invoke-direct {v0, v1, v2, v3}, Ljava/sql/SQLException;-><init>(Ljava/lang/String;Ljava/lang/String;I)V

    throw v0

    .line 21
    :cond_0
    iget-object v0, p0, Lio/liteglue/SQLiteGlueConnection;->db:Lio/liteglue/SQLDatabaseHandle;

    invoke-interface {v0}, Lio/liteglue/SQLDatabaseHandle;->close()I

    move-result v0

    .line 22
    if-eqz v0, :cond_1

    new-instance v1, Ljava/sql/SQLException;

    new-instance v2, Ljava/lang/StringBuilder;

    invoke-direct {v2}, Ljava/lang/StringBuilder;-><init>()V

    const-string v3, "sqlite3_close failure: "

    invoke-virtual {v2, v3}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v2

    iget-object v3, p0, Lio/liteglue/SQLiteGlueConnection;->db:Lio/liteglue/SQLDatabaseHandle;

    invoke-interface {v3}, Lio/liteglue/SQLDatabaseHandle;->getLastErrorMessage()Ljava/lang/String;

    move-result-object v3

    invoke-virtual {v2, v3}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v2

    invoke-virtual {v2}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v2

    const-string v3, "failure"

    invoke-direct {v1, v2, v3, v0}, Ljava/sql/SQLException;-><init>(Ljava/lang/String;Ljava/lang/String;I)V

    throw v1

    .line 23
    :cond_1
    const/4 v0, 0x0

    iput-object v0, p0, Lio/liteglue/SQLiteGlueConnection;->db:Lio/liteglue/SQLDatabaseHandle;

    .line 24
    return-void
.end method

.method public getLastInsertRowid()J
    .locals 4
    .annotation system Ldalvik/annotation/Throws;
        value = {
            Ljava/sql/SQLException;
        }
    .end annotation

    .prologue
    .line 55
    iget-object v0, p0, Lio/liteglue/SQLiteGlueConnection;->db:Lio/liteglue/SQLDatabaseHandle;

    if-nez v0, :cond_0

    new-instance v0, Ljava/sql/SQLException;

    const-string v1, "already disposed"

    const-string v2, "failed"

    const/16 v3, 0x15

    invoke-direct {v0, v1, v2, v3}, Ljava/sql/SQLException;-><init>(Ljava/lang/String;Ljava/lang/String;I)V

    throw v0

    .line 57
    :cond_0
    iget-object v0, p0, Lio/liteglue/SQLiteGlueConnection;->db:Lio/liteglue/SQLDatabaseHandle;

    invoke-interface {v0}, Lio/liteglue/SQLDatabaseHandle;->getLastInsertRowid()J

    move-result-wide v0

    return-wide v0
.end method

.method public getTotalChanges()I
    .locals 4
    .annotation system Ldalvik/annotation/Throws;
        value = {
            Ljava/sql/SQLException;
        }
    .end annotation

    .prologue
    .line 63
    iget-object v0, p0, Lio/liteglue/SQLiteGlueConnection;->db:Lio/liteglue/SQLDatabaseHandle;

    if-nez v0, :cond_0

    new-instance v0, Ljava/sql/SQLException;

    const-string v1, "already disposed"

    const-string v2, "failed"

    const/16 v3, 0x15

    invoke-direct {v0, v1, v2, v3}, Ljava/sql/SQLException;-><init>(Ljava/lang/String;Ljava/lang/String;I)V

    throw v0

    .line 65
    :cond_0
    iget-object v0, p0, Lio/liteglue/SQLiteGlueConnection;->db:Lio/liteglue/SQLDatabaseHandle;

    invoke-interface {v0}, Lio/liteglue/SQLDatabaseHandle;->getTotalChanges()I

    move-result v0

    return v0
.end method

.method public keyNativeString(Ljava/lang/String;)V
    .locals 4
    .annotation system Ldalvik/annotation/Throws;
        value = {
            Ljava/sql/SQLException;
        }
    .end annotation

    .prologue
    .line 29
    iget-object v0, p0, Lio/liteglue/SQLiteGlueConnection;->db:Lio/liteglue/SQLDatabaseHandle;

    if-nez v0, :cond_0

    new-instance v0, Ljava/sql/SQLException;

    const-string v1, "already disposed"

    const-string v2, "failed"

    const/16 v3, 0x15

    invoke-direct {v0, v1, v2, v3}, Ljava/sql/SQLException;-><init>(Ljava/lang/String;Ljava/lang/String;I)V

    throw v0

    .line 31
    :cond_0
    iget-object v0, p0, Lio/liteglue/SQLiteGlueConnection;->db:Lio/liteglue/SQLDatabaseHandle;

    invoke-interface {v0, p1}, Lio/liteglue/SQLDatabaseHandle;->keyNativeString(Ljava/lang/String;)I

    move-result v0

    .line 32
    if-eqz v0, :cond_1

    new-instance v1, Ljava/sql/SQLException;

    new-instance v2, Ljava/lang/StringBuilder;

    invoke-direct {v2}, Ljava/lang/StringBuilder;-><init>()V

    const-string v3, "sqlite3_key failure: "

    invoke-virtual {v2, v3}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v2

    iget-object v3, p0, Lio/liteglue/SQLiteGlueConnection;->db:Lio/liteglue/SQLDatabaseHandle;

    invoke-interface {v3}, Lio/liteglue/SQLDatabaseHandle;->getLastErrorMessage()Ljava/lang/String;

    move-result-object v3

    invoke-virtual {v2, v3}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v2

    invoke-virtual {v2}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v2

    const-string v3, "failure"

    invoke-direct {v1, v2, v3, v0}, Ljava/sql/SQLException;-><init>(Ljava/lang/String;Ljava/lang/String;I)V

    throw v1

    .line 33
    :cond_1
    return-void
.end method

.method public prepareStatement(Ljava/lang/String;)Lio/liteglue/SQLiteStatement;
    .locals 4
    .annotation system Ldalvik/annotation/Throws;
        value = {
            Ljava/sql/SQLException;
        }
    .end annotation

    .prologue
    const/16 v3, 0x15

    .line 38
    iget-object v0, p0, Lio/liteglue/SQLiteGlueConnection;->db:Lio/liteglue/SQLDatabaseHandle;

    if-nez v0, :cond_0

    new-instance v0, Ljava/sql/SQLException;

    const-string v1, "already disposed"

    const-string v2, "failed"

    invoke-direct {v0, v1, v2, v3}, Ljava/sql/SQLException;-><init>(Ljava/lang/String;Ljava/lang/String;I)V

    throw v0

    .line 41
    :cond_0
    if-nez p1, :cond_1

    new-instance v0, Ljava/sql/SQLException;

    const-string v1, "null argument"

    const-string v2, "failed"

    invoke-direct {v0, v1, v2, v3}, Ljava/sql/SQLException;-><init>(Ljava/lang/String;Ljava/lang/String;I)V

    throw v0

    .line 43
    :cond_1
    new-instance v0, Lio/liteglue/SQLiteGlueConnection$SQLGStatement;

    invoke-direct {v0, p0, p1}, Lio/liteglue/SQLiteGlueConnection$SQLGStatement;-><init>(Lio/liteglue/SQLiteGlueConnection;Ljava/lang/String;)V

    .line 44
    invoke-virtual {v0}, Lio/liteglue/SQLiteGlueConnection$SQLGStatement;->prepare()I

    move-result v1

    .line 45
    if-eqz v1, :cond_2

    .line 46
    new-instance v0, Ljava/sql/SQLException;

    new-instance v2, Ljava/lang/StringBuilder;

    invoke-direct {v2}, Ljava/lang/StringBuilder;-><init>()V

    const-string v3, "sqlite3_prepare_v2 failure: "

    invoke-virtual {v2, v3}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v2

    iget-object v3, p0, Lio/liteglue/SQLiteGlueConnection;->db:Lio/liteglue/SQLDatabaseHandle;

    invoke-interface {v3}, Lio/liteglue/SQLDatabaseHandle;->getLastErrorMessage()Ljava/lang/String;

    move-result-object v3

    invoke-virtual {v2, v3}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v2

    invoke-virtual {v2}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v2

    const-string v3, "failure"

    invoke-direct {v0, v2, v3, v1}, Ljava/sql/SQLException;-><init>(Ljava/lang/String;Ljava/lang/String;I)V

    throw v0

    .line 49
    :cond_2
    return-object v0
.end method
