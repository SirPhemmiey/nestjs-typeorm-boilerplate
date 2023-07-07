import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar' })
    email: string;

    @Column({ type: 'varchar' })
    firstName: string;

    @Column({ type: 'varchar' })
    lastName: string;

    @Column({ default: true })
    isActive: boolean;

    @Column({ type: 'boolean', default: false })
    isDeleted: boolean;

    /*
     * Create and Update Date Columns
     */

    @CreateDateColumn({
        type: 'timestamp without time zone',
        name: 'created_at',
    })
    createdAt: Date;

    @UpdateDateColumn({
        type: 'timestamp without time zone',
        name: 'updated_at',
    })
    updatedAt: Date;
}
