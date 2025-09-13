.class final enum Lio/sqlc/SQLiteAndroidDatabase$QueryType;
.super Ljava/lang/Enum;
.source "SQLiteAndroidDatabase.java"


# annotations
.annotation system Ldalvik/annotation/EnclosingClass;
    value = Lio/sqlc/SQLiteAndroidDatabase;
.end annotation

.annotation system Ldalvik/annotation/InnerClass;
    accessFlags = 0x4018
    name = "QueryType"
.end annotation

.annotation system Ldalvik/annotation/Signature;
    value = {
        "Ljava/lang/Enum",
        "<",
        "Lio/sqlc/SQLiteAndroidDatabase$QueryType;",
        ">;"
    }
.end annotation


# static fields
.field private static final synthetic $VALUES:[Lio/sqlc/SQLiteAndroidDatabase$QueryType;

.field public static final enum begin:Lio/sqlc/SQLiteAndroidDatabase$QueryType;

.field public static final enum commit:Lio/sqlc/SQLiteAndroidDatabase$QueryType;

.field public static final enum delete:Lio/sqlc/SQLiteAndroidDatabase$QueryType;

.field public static final enum insert:Lio/sqlc/SQLiteAndroidDatabase$QueryType;

.field public static final enum other:Lio/sqlc/SQLiteAndroidDatabase$QueryType;

.field public static final enum rollback:Lio/sqlc/SQLiteAndroidDatabase$QueryType;

.field public static final enum select:Lio/sqlc/SQLiteAndroidDatabase$QueryType;

.field public static final enum update:Lio/sqlc/SQLiteAndroidDatabase$QueryType;


# direct methods
.method static constructor <clinit>()V
    .locals 8

    .prologue
    const/4 v7, 0x4

    const/4 v6, 0x3

    const/4 v5, 0x2

    const/4 v4, 0x1

    const/4 v3, 0x0

    .line 565
    new-instance v0, Lio/sqlc/SQLiteAndroidDatabase$QueryType;

    const-string v1, "update"

    invoke-direct {v0, v1, v3}, Lio/sqlc/SQLiteAndroidDatabase$QueryType;-><init>(Ljava/lang/String;I)V

    sput-object v0, Lio/sqlc/SQLiteAndroidDatabase$QueryType;->update:Lio/sqlc/SQLiteAndroidDatabase$QueryType;

    .line 566
    new-instance v0, Lio/sqlc/SQLiteAndroidDatabase$QueryType;

    const-string v1, "insert"

    invoke-direct {v0, v1, v4}, Lio/sqlc/SQLiteAndroidDatabase$QueryType;-><init>(Ljava/lang/String;I)V

    sput-object v0, Lio/sqlc/SQLiteAndroidDatabase$QueryType;->insert:Lio/sqlc/SQLiteAndroidDatabase$QueryType;

    .line 567
    new-instance v0, Lio/sqlc/SQLiteAndroidDatabase$QueryType;

    const-string v1, "delete"

    invoke-direct {v0, v1, v5}, Lio/sqlc/SQLiteAndroidDatabase$QueryType;-><init>(Ljava/lang/String;I)V

    sput-object v0, Lio/sqlc/SQLiteAndroidDatabase$QueryType;->delete:Lio/sqlc/SQLiteAndroidDatabase$QueryType;

    .line 568
    new-instance v0, Lio/sqlc/SQLiteAndroidDatabase$QueryType;

    const-string v1, "select"

    invoke-direct {v0, v1, v6}, Lio/sqlc/SQLiteAndroidDatabase$QueryType;-><init>(Ljava/lang/String;I)V

    sput-object v0, Lio/sqlc/SQLiteAndroidDatabase$QueryType;->select:Lio/sqlc/SQLiteAndroidDatabase$QueryType;

    .line 569
    new-instance v0, Lio/sqlc/SQLiteAndroidDatabase$QueryType;

    const-string v1, "begin"

    invoke-direct {v0, v1, v7}, Lio/sqlc/SQLiteAndroidDatabase$QueryType;-><init>(Ljava/lang/String;I)V

    sput-object v0, Lio/sqlc/SQLiteAndroidDatabase$QueryType;->begin:Lio/sqlc/SQLiteAndroidDatabase$QueryType;

    .line 570
    new-instance v0, Lio/sqlc/SQLiteAndroidDatabase$QueryType;

    const-string v1, "commit"

    const/4 v2, 0x5

    invoke-direct {v0, v1, v2}, Lio/sqlc/SQLiteAndroidDatabase$QueryType;-><init>(Ljava/lang/String;I)V

    sput-object v0, Lio/sqlc/SQLiteAndroidDatabase$QueryType;->commit:Lio/sqlc/SQLiteAndroidDatabase$QueryType;

    .line 571
    new-instance v0, Lio/sqlc/SQLiteAndroidDatabase$QueryType;

    const-string v1, "rollback"

    const/4 v2, 0x6

    invoke-direct {v0, v1, v2}, Lio/sqlc/SQLiteAndroidDatabase$QueryType;-><init>(Ljava/lang/String;I)V

    sput-object v0, Lio/sqlc/SQLiteAndroidDatabase$QueryType;->rollback:Lio/sqlc/SQLiteAndroidDatabase$QueryType;

    .line 572
    new-instance v0, Lio/sqlc/SQLiteAndroidDatabase$QueryType;

    const-string v1, "other"

    const/4 v2, 0x7

    invoke-direct {v0, v1, v2}, Lio/sqlc/SQLiteAndroidDatabase$QueryType;-><init>(Ljava/lang/String;I)V

    sput-object v0, Lio/sqlc/SQLiteAndroidDatabase$QueryType;->other:Lio/sqlc/SQLiteAndroidDatabase$QueryType;

    .line 564
    const/16 v0, 0x8

    new-array v0, v0, [Lio/sqlc/SQLiteAndroidDatabase$QueryType;

    sget-object v1, Lio/sqlc/SQLiteAndroidDatabase$QueryType;->update:Lio/sqlc/SQLiteAndroidDatabase$QueryType;

    aput-object v1, v0, v3

    sget-object v1, Lio/sqlc/SQLiteAndroidDatabase$QueryType;->insert:Lio/sqlc/SQLiteAndroidDatabase$QueryType;

    aput-object v1, v0, v4

    sget-object v1, Lio/sqlc/SQLiteAndroidDatabase$QueryType;->delete:Lio/sqlc/SQLiteAndroidDatabase$QueryType;

    aput-object v1, v0, v5

    sget-object v1, Lio/sqlc/SQLiteAndroidDatabase$QueryType;->select:Lio/sqlc/SQLiteAndroidDatabase$QueryType;

    aput-object v1, v0, v6

    sget-object v1, Lio/sqlc/SQLiteAndroidDatabase$QueryType;->begin:Lio/sqlc/SQLiteAndroidDatabase$QueryType;

    aput-object v1, v0, v7

    const/4 v1, 0x5

    sget-object v2, Lio/sqlc/SQLiteAndroidDatabase$QueryType;->commit:Lio/sqlc/SQLiteAndroidDatabase$QueryType;

    aput-object v2, v0, v1

    const/4 v1, 0x6

    sget-object v2, Lio/sqlc/SQLiteAndroidDatabase$QueryType;->rollback:Lio/sqlc/SQLiteAndroidDatabase$QueryType;

    aput-object v2, v0, v1

    const/4 v1, 0x7

    sget-object v2, Lio/sqlc/SQLiteAndroidDatabase$QueryType;->other:Lio/sqlc/SQLiteAndroidDatabase$QueryType;

    aput-object v2, v0, v1

    sput-object v0, Lio/sqlc/SQLiteAndroidDatabase$QueryType;->$VALUES:[Lio/sqlc/SQLiteAndroidDatabase$QueryType;

    return-void
.end method

.method private constructor <init>(Ljava/lang/String;I)V
    .locals 0
    .annotation system Ldalvik/annotation/Signature;
        value = {
            "()V"
        }
    .end annotation

    .prologue
    .line 564
    invoke-direct {p0, p1, p2}, Ljava/lang/Enum;-><init>(Ljava/lang/String;I)V

    return-void
.end method

.method public static valueOf(Ljava/lang/String;)Lio/sqlc/SQLiteAndroidDatabase$QueryType;
    .locals 1
    .param p0, "name"    # Ljava/lang/String;

    .prologue
    .line 564
    const-class v0, Lio/sqlc/SQLiteAndroidDatabase$QueryType;

    invoke-static {v0, p0}, Ljava/lang/Enum;->valueOf(Ljava/lang/Class;Ljava/lang/String;)Ljava/lang/Enum;

    move-result-object v0

    check-cast v0, Lio/sqlc/SQLiteAndroidDatabase$QueryType;

    return-object v0
.end method

.method public static values()[Lio/sqlc/SQLiteAndroidDatabase$QueryType;
    .locals 1

    .prologue
    .line 564
    sget-object v0, Lio/sqlc/SQLiteAndroidDatabase$QueryType;->$VALUES:[Lio/sqlc/SQLiteAndroidDatabase$QueryType;

    invoke-virtual {v0}, [Lio/sqlc/SQLiteAndroidDatabase$QueryType;->clone()Ljava/lang/Object;

    move-result-object v0

    check-cast v0, [Lio/sqlc/SQLiteAndroidDatabase$QueryType;

    return-object v0
.end method
