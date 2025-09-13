.class Lio/liteglue/SQLGDatabaseHandle$SQLGStatementHandle;
.super Ljava/lang/Object;
.source "SQLGDatabaseHandle.java"

# interfaces
.implements Lio/liteglue/SQLStatementHandle;


# annotations
.annotation system Ldalvik/annotation/EnclosingClass;
    value = Lio/liteglue/SQLGDatabaseHandle;
.end annotation

.annotation system Ldalvik/annotation/InnerClass;
    accessFlags = 0x2
    name = "SQLGStatementHandle"
.end annotation


# instance fields
.field sql:Ljava/lang/String;

.field private sthandle:J

.field final synthetic this$0:Lio/liteglue/SQLGDatabaseHandle;


# direct methods
.method private constructor <init>(Lio/liteglue/SQLGDatabaseHandle;Ljava/lang/String;)V
    .locals 2

    .prologue
    .line 75
    iput-object p1, p0, Lio/liteglue/SQLGDatabaseHandle$SQLGStatementHandle;->this$0:Lio/liteglue/SQLGDatabaseHandle;

    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    .line 207
    const/4 v0, 0x0

    iput-object v0, p0, Lio/liteglue/SQLGDatabaseHandle$SQLGStatementHandle;->sql:Ljava/lang/String;

    .line 208
    const-wide/16 v0, 0x0

    iput-wide v0, p0, Lio/liteglue/SQLGDatabaseHandle$SQLGStatementHandle;->sthandle:J

    .line 76
    iput-object p2, p0, Lio/liteglue/SQLGDatabaseHandle$SQLGStatementHandle;->sql:Ljava/lang/String;

    .line 77
    return-void
.end method

.method synthetic constructor <init>(Lio/liteglue/SQLGDatabaseHandle;Ljava/lang/String;Lio/liteglue/SQLGDatabaseHandle$1;)V
    .locals 0

    .prologue
    .line 74
    invoke-direct {p0, p1, p2}, Lio/liteglue/SQLGDatabaseHandle$SQLGStatementHandle;-><init>(Lio/liteglue/SQLGDatabaseHandle;Ljava/lang/String;)V

    return-void
.end method


# virtual methods
.method public bindDouble(ID)I
    .locals 4

    .prologue
    .line 94
    iget-wide v0, p0, Lio/liteglue/SQLGDatabaseHandle$SQLGStatementHandle;->sthandle:J

    const-wide/16 v2, 0x0

    cmp-long v0, v0, v2

    if-nez v0, :cond_0

    const/16 v0, 0x15

    .line 96
    :goto_0
    return v0

    :cond_0
    iget-wide v0, p0, Lio/liteglue/SQLGDatabaseHandle$SQLGStatementHandle;->sthandle:J

    invoke-static {v0, v1, p1, p2, p3}, Lio/liteglue/SQLiteNative;->sqlc_st_bind_double(JID)I

    move-result v0

    goto :goto_0
.end method

.method public bindInteger(II)I
    .locals 4

    .prologue
    .line 102
    iget-wide v0, p0, Lio/liteglue/SQLGDatabaseHandle$SQLGStatementHandle;->sthandle:J

    const-wide/16 v2, 0x0

    cmp-long v0, v0, v2

    if-nez v0, :cond_0

    const/16 v0, 0x15

    .line 104
    :goto_0
    return v0

    :cond_0
    iget-wide v0, p0, Lio/liteglue/SQLGDatabaseHandle$SQLGStatementHandle;->sthandle:J

    invoke-static {v0, v1, p1, p2}, Lio/liteglue/SQLiteNative;->sqlc_st_bind_int(JII)I

    move-result v0

    goto :goto_0
.end method

.method public bindLong(IJ)I
    .locals 4

    .prologue
    .line 110
    iget-wide v0, p0, Lio/liteglue/SQLGDatabaseHandle$SQLGStatementHandle;->sthandle:J

    const-wide/16 v2, 0x0

    cmp-long v0, v0, v2

    if-nez v0, :cond_0

    const/16 v0, 0x15

    .line 112
    :goto_0
    return v0

    :cond_0
    iget-wide v0, p0, Lio/liteglue/SQLGDatabaseHandle$SQLGStatementHandle;->sthandle:J

    invoke-static {v0, v1, p1, p2, p3}, Lio/liteglue/SQLiteNative;->sqlc_st_bind_long(JIJ)I

    move-result v0

    goto :goto_0
.end method

.method public bindNull(I)I
    .locals 4

    .prologue
    .line 118
    iget-wide v0, p0, Lio/liteglue/SQLGDatabaseHandle$SQLGStatementHandle;->sthandle:J

    const-wide/16 v2, 0x0

    cmp-long v0, v0, v2

    if-nez v0, :cond_0

    const/16 v0, 0x15

    .line 120
    :goto_0
    return v0

    :cond_0
    iget-wide v0, p0, Lio/liteglue/SQLGDatabaseHandle$SQLGStatementHandle;->sthandle:J

    invoke-static {v0, v1, p1}, Lio/liteglue/SQLiteNative;->sqlc_st_bind_null(JI)I

    move-result v0

    goto :goto_0
.end method

.method public bindTextNativeString(ILjava/lang/String;)I
    .locals 4

    .prologue
    .line 126
    iget-wide v0, p0, Lio/liteglue/SQLGDatabaseHandle$SQLGStatementHandle;->sthandle:J

    const-wide/16 v2, 0x0

    cmp-long v0, v0, v2

    if-nez v0, :cond_0

    const/16 v0, 0x15

    .line 128
    :goto_0
    return v0

    :cond_0
    iget-wide v0, p0, Lio/liteglue/SQLGDatabaseHandle$SQLGStatementHandle;->sthandle:J

    invoke-static {v0, v1, p1, p2}, Lio/liteglue/SQLiteNative;->sqlc_st_bind_text_native(JILjava/lang/String;)I

    move-result v0

    goto :goto_0
.end method

.method public finish()I
    .locals 6

    .prologue
    const-wide/16 v4, 0x0

    .line 198
    iget-wide v0, p0, Lio/liteglue/SQLGDatabaseHandle$SQLGStatementHandle;->sthandle:J

    cmp-long v0, v0, v4

    if-nez v0, :cond_0

    const/16 v0, 0x15

    .line 204
    :goto_0
    return v0

    .line 200
    :cond_0
    iget-wide v0, p0, Lio/liteglue/SQLGDatabaseHandle$SQLGStatementHandle;->sthandle:J

    .line 201
    const/4 v2, 0x0

    iput-object v2, p0, Lio/liteglue/SQLGDatabaseHandle$SQLGStatementHandle;->sql:Ljava/lang/String;

    .line 202
    iput-wide v4, p0, Lio/liteglue/SQLGDatabaseHandle$SQLGStatementHandle;->sthandle:J

    .line 204
    invoke-static {v0, v1}, Lio/liteglue/SQLiteNative;->sqlc_st_finish(J)I

    move-result v0

    goto :goto_0
.end method

.method public getColumnCount()I
    .locals 4

    .prologue
    .line 142
    iget-wide v0, p0, Lio/liteglue/SQLGDatabaseHandle$SQLGStatementHandle;->sthandle:J

    const-wide/16 v2, 0x0

    cmp-long v0, v0, v2

    if-nez v0, :cond_0

    const/4 v0, -0x1

    .line 144
    :goto_0
    return v0

    :cond_0
    iget-wide v0, p0, Lio/liteglue/SQLGDatabaseHandle$SQLGStatementHandle;->sthandle:J

    invoke-static {v0, v1}, Lio/liteglue/SQLiteNative;->sqlc_st_column_count(J)I

    move-result v0

    goto :goto_0
.end method

.method public getColumnDouble(I)D
    .locals 4

    .prologue
    .line 166
    iget-wide v0, p0, Lio/liteglue/SQLGDatabaseHandle$SQLGStatementHandle;->sthandle:J

    const-wide/16 v2, 0x0

    cmp-long v0, v0, v2

    if-nez v0, :cond_0

    const-wide/high16 v0, -0x4010000000000000L    # -1.0

    .line 168
    :goto_0
    return-wide v0

    :cond_0
    iget-wide v0, p0, Lio/liteglue/SQLGDatabaseHandle$SQLGStatementHandle;->sthandle:J

    invoke-static {v0, v1, p1}, Lio/liteglue/SQLiteNative;->sqlc_st_column_double(JI)D

    move-result-wide v0

    goto :goto_0
.end method

.method public getColumnInteger(I)I
    .locals 4

    .prologue
    .line 174
    iget-wide v0, p0, Lio/liteglue/SQLGDatabaseHandle$SQLGStatementHandle;->sthandle:J

    const-wide/16 v2, 0x0

    cmp-long v0, v0, v2

    if-nez v0, :cond_0

    const/4 v0, -0x1

    .line 176
    :goto_0
    return v0

    :cond_0
    iget-wide v0, p0, Lio/liteglue/SQLGDatabaseHandle$SQLGStatementHandle;->sthandle:J

    invoke-static {v0, v1, p1}, Lio/liteglue/SQLiteNative;->sqlc_st_column_int(JI)I

    move-result v0

    goto :goto_0
.end method

.method public getColumnLong(I)J
    .locals 4

    .prologue
    .line 182
    iget-wide v0, p0, Lio/liteglue/SQLGDatabaseHandle$SQLGStatementHandle;->sthandle:J

    const-wide/16 v2, 0x0

    cmp-long v0, v0, v2

    if-nez v0, :cond_0

    const-wide/16 v0, -0x1

    .line 184
    :goto_0
    return-wide v0

    :cond_0
    iget-wide v0, p0, Lio/liteglue/SQLGDatabaseHandle$SQLGStatementHandle;->sthandle:J

    invoke-static {v0, v1, p1}, Lio/liteglue/SQLiteNative;->sqlc_st_column_long(JI)J

    move-result-wide v0

    goto :goto_0
.end method

.method public getColumnName(I)Ljava/lang/String;
    .locals 4

    .prologue
    .line 150
    iget-wide v0, p0, Lio/liteglue/SQLGDatabaseHandle$SQLGStatementHandle;->sthandle:J

    const-wide/16 v2, 0x0

    cmp-long v0, v0, v2

    if-nez v0, :cond_0

    const/4 v0, 0x0

    .line 152
    :goto_0
    return-object v0

    :cond_0
    iget-wide v0, p0, Lio/liteglue/SQLGDatabaseHandle$SQLGStatementHandle;->sthandle:J

    invoke-static {v0, v1, p1}, Lio/liteglue/SQLiteNative;->sqlc_st_column_name(JI)Ljava/lang/String;

    move-result-object v0

    goto :goto_0
.end method

.method public getColumnTextNativeString(I)Ljava/lang/String;
    .locals 4

    .prologue
    .line 190
    iget-wide v0, p0, Lio/liteglue/SQLGDatabaseHandle$SQLGStatementHandle;->sthandle:J

    const-wide/16 v2, 0x0

    cmp-long v0, v0, v2

    if-nez v0, :cond_0

    const/4 v0, 0x0

    .line 192
    :goto_0
    return-object v0

    :cond_0
    iget-wide v0, p0, Lio/liteglue/SQLGDatabaseHandle$SQLGStatementHandle;->sthandle:J

    invoke-static {v0, v1, p1}, Lio/liteglue/SQLiteNative;->sqlc_st_column_text_native(JI)Ljava/lang/String;

    move-result-object v0

    goto :goto_0
.end method

.method public getColumnType(I)I
    .locals 4

    .prologue
    .line 158
    iget-wide v0, p0, Lio/liteglue/SQLGDatabaseHandle$SQLGStatementHandle;->sthandle:J

    const-wide/16 v2, 0x0

    cmp-long v0, v0, v2

    if-nez v0, :cond_0

    const/4 v0, -0x1

    .line 160
    :goto_0
    return v0

    :cond_0
    iget-wide v0, p0, Lio/liteglue/SQLGDatabaseHandle$SQLGStatementHandle;->sthandle:J

    invoke-static {v0, v1, p1}, Lio/liteglue/SQLiteNative;->sqlc_st_column_type(JI)I

    move-result v0

    goto :goto_0
.end method

.method public prepare()I
    .locals 6

    .prologue
    const-wide/16 v4, 0x0

    .line 82
    iget-object v0, p0, Lio/liteglue/SQLGDatabaseHandle$SQLGStatementHandle;->sql:Ljava/lang/String;

    if-eqz v0, :cond_0

    iget-wide v0, p0, Lio/liteglue/SQLGDatabaseHandle$SQLGStatementHandle;->sthandle:J

    cmp-long v0, v0, v4

    if-eqz v0, :cond_1

    :cond_0
    const/16 v0, 0x15

    .line 88
    :goto_0
    return v0

    .line 84
    :cond_1
    iget-object v0, p0, Lio/liteglue/SQLGDatabaseHandle$SQLGStatementHandle;->this$0:Lio/liteglue/SQLGDatabaseHandle;

    invoke-static {v0}, Lio/liteglue/SQLGDatabaseHandle;->access$100(Lio/liteglue/SQLGDatabaseHandle;)J

    move-result-wide v0

    iget-object v2, p0, Lio/liteglue/SQLGDatabaseHandle$SQLGStatementHandle;->sql:Ljava/lang/String;

    invoke-static {v0, v1, v2}, Lio/liteglue/SQLiteNative;->sqlc_db_prepare_st(JLjava/lang/String;)J

    move-result-wide v0

    .line 85
    cmp-long v2, v0, v4

    if-gez v2, :cond_2

    neg-long v0, v0

    long-to-int v0, v0

    goto :goto_0

    .line 87
    :cond_2
    iput-wide v0, p0, Lio/liteglue/SQLGDatabaseHandle$SQLGStatementHandle;->sthandle:J

    .line 88
    const/4 v0, 0x0

    goto :goto_0
.end method

.method public step()I
    .locals 4

    .prologue
    .line 134
    iget-wide v0, p0, Lio/liteglue/SQLGDatabaseHandle$SQLGStatementHandle;->sthandle:J

    const-wide/16 v2, 0x0

    cmp-long v0, v0, v2

    if-nez v0, :cond_0

    const/16 v0, 0x15

    .line 136
    :goto_0
    return v0

    :cond_0
    iget-wide v0, p0, Lio/liteglue/SQLGDatabaseHandle$SQLGStatementHandle;->sthandle:J

    invoke-static {v0, v1}, Lio/liteglue/SQLiteNative;->sqlc_st_step(J)I

    move-result v0

    goto :goto_0
.end method
