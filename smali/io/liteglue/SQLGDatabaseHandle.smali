.class Lio/liteglue/SQLGDatabaseHandle;
.super Ljava/lang/Object;
.source "SQLGDatabaseHandle.java"

# interfaces
.implements Lio/liteglue/SQLDatabaseHandle;


# annotations
.annotation system Ldalvik/annotation/MemberClasses;
    value = {
        Lio/liteglue/SQLGDatabaseHandle$SQLGStatementHandle;
    }
.end annotation


# instance fields
.field dbfilename:Ljava/lang/String;

.field private dbhandle:J

.field openflags:I


# direct methods
.method public constructor <init>(Ljava/lang/String;I)V
    .locals 2

    .prologue
    .line 4
    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    .line 211
    const/4 v0, 0x0

    iput-object v0, p0, Lio/liteglue/SQLGDatabaseHandle;->dbfilename:Ljava/lang/String;

    .line 212
    const/4 v0, 0x0

    iput v0, p0, Lio/liteglue/SQLGDatabaseHandle;->openflags:I

    .line 213
    const-wide/16 v0, 0x0

    iput-wide v0, p0, Lio/liteglue/SQLGDatabaseHandle;->dbhandle:J

    .line 5
    iput-object p1, p0, Lio/liteglue/SQLGDatabaseHandle;->dbfilename:Ljava/lang/String;

    .line 6
    iput p2, p0, Lio/liteglue/SQLGDatabaseHandle;->openflags:I

    .line 7
    return-void
.end method

.method static synthetic access$100(Lio/liteglue/SQLGDatabaseHandle;)J
    .locals 2

    .prologue
    .line 3
    iget-wide v0, p0, Lio/liteglue/SQLGDatabaseHandle;->dbhandle:J

    return-wide v0
.end method


# virtual methods
.method public close()I
    .locals 4

    .prologue
    .line 32
    iget-wide v0, p0, Lio/liteglue/SQLGDatabaseHandle;->dbhandle:J

    const-wide/16 v2, 0x0

    cmp-long v0, v0, v2

    if-nez v0, :cond_0

    const/16 v0, 0x15

    .line 34
    :goto_0
    return v0

    :cond_0
    iget-wide v0, p0, Lio/liteglue/SQLGDatabaseHandle;->dbhandle:J

    invoke-static {v0, v1}, Lio/liteglue/SQLiteNative;->sqlc_db_close(J)I

    move-result v0

    goto :goto_0
.end method

.method public getLastErrorMessage()Ljava/lang/String;
    .locals 4

    .prologue
    .line 69
    iget-wide v0, p0, Lio/liteglue/SQLGDatabaseHandle;->dbhandle:J

    const-wide/16 v2, 0x0

    cmp-long v0, v0, v2

    if-nez v0, :cond_0

    const/4 v0, 0x0

    .line 70
    :goto_0
    return-object v0

    :cond_0
    iget-wide v0, p0, Lio/liteglue/SQLGDatabaseHandle;->dbhandle:J

    invoke-static {v0, v1}, Lio/liteglue/SQLiteNative;->sqlc_db_errmsg_native(J)Ljava/lang/String;

    move-result-object v0

    goto :goto_0
.end method

.method public getLastInsertRowid()J
    .locals 4

    .prologue
    .line 53
    iget-wide v0, p0, Lio/liteglue/SQLGDatabaseHandle;->dbhandle:J

    const-wide/16 v2, 0x0

    cmp-long v0, v0, v2

    if-nez v0, :cond_0

    const-wide/16 v0, -0x1

    .line 55
    :goto_0
    return-wide v0

    :cond_0
    iget-wide v0, p0, Lio/liteglue/SQLGDatabaseHandle;->dbhandle:J

    invoke-static {v0, v1}, Lio/liteglue/SQLiteNative;->sqlc_db_last_insert_rowid(J)J

    move-result-wide v0

    goto :goto_0
.end method

.method public getTotalChanges()I
    .locals 4

    .prologue
    .line 61
    iget-wide v0, p0, Lio/liteglue/SQLGDatabaseHandle;->dbhandle:J

    const-wide/16 v2, 0x0

    cmp-long v0, v0, v2

    if-nez v0, :cond_0

    const/4 v0, -0x1

    .line 63
    :goto_0
    return v0

    :cond_0
    iget-wide v0, p0, Lio/liteglue/SQLGDatabaseHandle;->dbhandle:J

    invoke-static {v0, v1}, Lio/liteglue/SQLiteNative;->sqlc_db_total_changes(J)I

    move-result v0

    goto :goto_0
.end method

.method public isOpen()Z
    .locals 4

    .prologue
    .line 39
    iget-wide v0, p0, Lio/liteglue/SQLGDatabaseHandle;->dbhandle:J

    const-wide/16 v2, 0x0

    cmp-long v0, v0, v2

    if-eqz v0, :cond_0

    const/4 v0, 0x1

    :goto_0
    return v0

    :cond_0
    const/4 v0, 0x0

    goto :goto_0
.end method

.method public keyNativeString(Ljava/lang/String;)I
    .locals 4

    .prologue
    .line 24
    iget-wide v0, p0, Lio/liteglue/SQLGDatabaseHandle;->dbhandle:J

    const-wide/16 v2, 0x0

    cmp-long v0, v0, v2

    if-nez v0, :cond_0

    const/16 v0, 0x15

    .line 26
    :goto_0
    return v0

    :cond_0
    iget-wide v0, p0, Lio/liteglue/SQLGDatabaseHandle;->dbhandle:J

    invoke-static {v0, v1, p1}, Lio/liteglue/SQLiteNative;->sqlc_db_key_native_string(JLjava/lang/String;)I

    move-result v0

    goto :goto_0
.end method

.method public newStatementHandle(Ljava/lang/String;)Lio/liteglue/SQLStatementHandle;
    .locals 6

    .prologue
    const/4 v0, 0x0

    .line 45
    iget-wide v2, p0, Lio/liteglue/SQLGDatabaseHandle;->dbhandle:J

    const-wide/16 v4, 0x0

    cmp-long v1, v2, v4

    if-nez v1, :cond_0

    .line 47
    :goto_0
    return-object v0

    :cond_0
    new-instance v1, Lio/liteglue/SQLGDatabaseHandle$SQLGStatementHandle;

    invoke-direct {v1, p0, p1, v0}, Lio/liteglue/SQLGDatabaseHandle$SQLGStatementHandle;-><init>(Lio/liteglue/SQLGDatabaseHandle;Ljava/lang/String;Lio/liteglue/SQLGDatabaseHandle$1;)V

    move-object v0, v1

    goto :goto_0
.end method

.method public open()I
    .locals 4

    .prologue
    const-wide/16 v2, 0x0

    .line 12
    iget-object v0, p0, Lio/liteglue/SQLGDatabaseHandle;->dbfilename:Ljava/lang/String;

    if-eqz v0, :cond_0

    iget-wide v0, p0, Lio/liteglue/SQLGDatabaseHandle;->dbhandle:J

    cmp-long v0, v0, v2

    if-eqz v0, :cond_1

    :cond_0
    const/16 v0, 0x15

    .line 18
    :goto_0
    return v0

    .line 14
    :cond_1
    iget-object v0, p0, Lio/liteglue/SQLGDatabaseHandle;->dbfilename:Ljava/lang/String;

    iget v1, p0, Lio/liteglue/SQLGDatabaseHandle;->openflags:I

    invoke-static {v0, v1}, Lio/liteglue/SQLiteNative;->sqlc_db_open(Ljava/lang/String;I)J

    move-result-wide v0

    .line 15
    cmp-long v2, v0, v2

    if-gez v2, :cond_2

    neg-long v0, v0

    long-to-int v0, v0

    goto :goto_0

    .line 17
    :cond_2
    iput-wide v0, p0, Lio/liteglue/SQLGDatabaseHandle;->dbhandle:J

    .line 18
    const/4 v0, 0x0

    goto :goto_0
.end method
