import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitDb1746009198869 implements MigrationInterface {
  name = 'InitDb1746009198869';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."devices_status_enum" AS ENUM('pending activce', 'offline', 'online')`,
    );
    await queryRunner.query(
      `CREATE TABLE "devices" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "name" character varying(50) NOT NULL, "key" character varying(100) NOT NULL, "status" "public"."devices_status_enum" NOT NULL DEFAULT 'pending activce', "description" text, "owner_id" uuid, "ownerId" uuid, CONSTRAINT "PK_b1514758245c12daf43486dd1f0" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."users_status_enum" AS ENUM('P', 'A', 'B')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."users_role_enum" AS ENUM('customer', 'admin')`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "full_name" character varying(50) NOT NULL, "age" integer NOT NULL, "phone_number" character varying(10) NOT NULL, "password" character varying NOT NULL, "refresh_token" character varying, "status" "public"."users_status_enum" NOT NULL DEFAULT 'P', "last_time_blocked" TIMESTAMP, "role" "public"."users_role_enum" NOT NULL DEFAULT 'customer', "email" character varying(255), CONSTRAINT "UQ_17d1817f241f10a3dbafb169fd2" UNIQUE ("phone_number"), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "chat_conversations" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "conversation_id" character varying(255) NOT NULL, "message_id" character varying(255) NOT NULL, "user_id" uuid NOT NULL, CONSTRAINT "REL_7f9e5689ad3d7f45172fc156fb" UNIQUE ("user_id"), CONSTRAINT "PK_ff117d9f57807c4f2e3034a39f3" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "devices" ADD CONSTRAINT "FK_968904d168816becbe1012dabcf" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "chat_conversations" ADD CONSTRAINT "FK_7f9e5689ad3d7f45172fc156fbf" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "chat_conversations" DROP CONSTRAINT "FK_7f9e5689ad3d7f45172fc156fbf"`,
    );
    await queryRunner.query(
      `ALTER TABLE "devices" DROP CONSTRAINT "FK_968904d168816becbe1012dabcf"`,
    );
    await queryRunner.query(`DROP TABLE "chat_conversations"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
    await queryRunner.query(`DROP TYPE "public"."users_status_enum"`);
    await queryRunner.query(`DROP TABLE "devices"`);
    await queryRunner.query(`DROP TYPE "public"."devices_status_enum"`);
  }
}
