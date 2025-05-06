import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDeviceTypeColumn1746512345678 implements MigrationInterface {
  name = 'AddDeviceTypeColumn1746512345678';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Tạo enum mới
    await queryRunner.query(`
      CREATE TYPE "public"."devices_type_enum" AS ENUM (
        'SENSOR_HUMIDITY',
        'SENSOR_TEMPERATURE',
        'ACTUATOR_PUMP',
        'ACTUATOR_FAN',
        'ACTUATOR_LIGHT',
        'CAMERA',
        'OTHERS'
      );
    `);

    // 2. Thêm cột mới vào bảng "devices"
    await queryRunner.query(`
      ALTER TABLE "devices"
      ADD "type" "public"."devices_type_enum" NOT NULL DEFAULT 'OTHERS'
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // 1. Xoá cột "type"
    await queryRunner.query(`
      ALTER TABLE "devices"
      DROP COLUMN "type"
    `);

    // 2. Xoá enum
    await queryRunner.query(`
      DROP TYPE "public"."devices_type_enum"
    `);
  }
}
