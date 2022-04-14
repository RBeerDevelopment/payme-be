import { Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn, UpdateDateColumn, BaseEntity } from "typeorm";
import { PaymentRequest } from "./payment-request";
import { Paypal } from "./paypal";
import { Sepa } from "./sepa";


@Entity()
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
        id: number;

    @Column()
        firstName: string;

    @Column()
        lastName: string;

    @Column({ unique: true })
        username: string;

    @Column({ unique: true })
        email: string;

    @Column()
        passwordHash: string;

    @Column({ default: "" })
        avatarPath?: string;

    @OneToMany(() => PaymentRequest, (paymentRequest) => paymentRequest.user, { createForeignKeyConstraints: false })
        paymentRequests: PaymentRequest[];

    @OneToMany(() => Sepa, (sepa) => sepa.user, { createForeignKeyConstraints: false })
        sepa: Sepa[];

    @OneToMany(() => Paypal, (paypal) => paypal.user, { createForeignKeyConstraints: false })
        paypal: Paypal[];
    
    // @CreateDateColumn()
    //     createdAt: Date;
    
    // @UpdateDateColumn()
    //     updatedAt: Date;

    // @Column({ type: "timestamp", nullable: true })
    //     lastLogin?: Date;


    static findById(id: number) {
        return this.createQueryBuilder("user")
            // .leftJoinAndSelect("user.sepa", "sepa")
            // .leftJoinAndSelect("user.paypal", "paypal")
            // .leftJoinAndSelect("user.paymentRequest", "paymentRequest")
            .where("user.id = :id", { id })
            .getOne();
    }

    static async addUser(firstName: string, lastName: string, username: string, email: string, passwordHash: string, avatarPath: string): Promise<User | null> {
        const result = await this.createQueryBuilder()
            .insert()
            .values([
                { firstName, lastName, email, username, passwordHash, avatarPath }
            ])
            .execute();
        
        return await this.findById(result.identifiers[0].id);
    }
}
