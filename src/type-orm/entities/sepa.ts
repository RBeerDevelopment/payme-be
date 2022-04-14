import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, BaseEntity } from "typeorm";
import { User } from "./user";

@Entity()
export class Sepa extends BaseEntity {
    @PrimaryGeneratedColumn()
        id: number;

    @Column()
        accountName?: string;

    @Column()
        iban: string;

    @Column()
        bic: string;

    @Column()
        bankName: string;

    // @CreateDateColumn()
    //     createdAt: Date;

    @ManyToOne(() => User, (user) => user.sepa, { createForeignKeyConstraints: false })
        user: User;

    static async addSepa(iban: string, bic: string, bankName: string, uId: number, accountName?: string): Promise<Sepa | null> {

        const result = await this.createQueryBuilder()
            .insert()
            .values([
                { iban, bic, bankName, accountName,  user: { id: uId } }
            ])
            .execute();
                    
        return await this.findOneBy({ id: result.identifiers[0].id });
    }
}
