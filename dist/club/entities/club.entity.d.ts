export declare enum ClubStatus {
    PENDING = "PENDING",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED"
}
export declare class Club {
    id: number;
    name: string;
    address: string;
    phone: string;
    openingTime: string;
    closingTime: string;
    status: ClubStatus;
    ownerId: number;
    termsAcceptedAt: Date;
    strikes: number;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}
