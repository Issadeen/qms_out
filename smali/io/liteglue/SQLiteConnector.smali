.class public Lio/liteglue/SQLiteConnector;
.super Ljava/lang/Object;
.source "SQLiteConnector.java"

# interfaces
.implements Lio/liteglue/SQLiteConnectionFactory;


# static fields
.field static isLibLoaded:Z


# direct methods
.method static constructor <clinit>()V
    .locals 1

    .prologue
    .line 4
    const/4 v0, 0x0

    sput-boolean v0, Lio/liteglue/SQLiteConnector;->isLibLoaded:Z

    return-void
.end method

.method public constructor <init>()V
    .locals 2

    .prologue
    const/4 v1, 0x1

    .line 6
    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    .line 7
    sget-boolean v0, Lio/liteglue/SQLiteConnector;->isLibLoaded:Z

    if-nez v0, :cond_1

    .line 8
    const-string v0, "sqlc-native-driver"

    invoke-static {v0}, Ljava/lang/System;->loadLibrary(Ljava/lang/String;)V

    .line 10
    invoke-static {v1}, Lio/liteglue/SQLiteNative;->sqlc_api_version_check(I)I

    move-result v0

    if-eqz v0, :cond_0

    .line 11
    new-instance v0, Ljava/lang/RuntimeException;

    const-string v1, "native library version mismatch"

    invoke-direct {v0, v1}, Ljava/lang/RuntimeException;-><init>(Ljava/lang/String;)V

    throw v0

    .line 14
    :cond_0
    sput-boolean v1, Lio/liteglue/SQLiteConnector;->isLibLoaded:Z

    .line 16
    :cond_1
    return-void
.end method


# virtual methods
.method public newSQLiteConnection(Ljava/lang/String;I)Lio/liteglue/SQLiteConnection;
    .locals 1
    .annotation system Ldalvik/annotation/Throws;
        value = {
            Ljava/sql/SQLException;
        }
    .end annotation

    .prologue
    .line 20
    new-instance v0, Lio/liteglue/SQLiteGlueConnection;

    invoke-direct {v0, p1, p2}, Lio/liteglue/SQLiteGlueConnection;-><init>(Ljava/lang/String;I)V

    return-object v0
.end method
