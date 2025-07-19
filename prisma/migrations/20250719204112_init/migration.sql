-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'STAFF', 'VIEWER');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('AVAILABLE', 'BUSY', 'MAINTENANCE');

-- CreateEnum
CREATE TYPE "Expense_Type" AS ENUM ('FUEL', 'TOLL', 'REPAIR', 'DRIVER', 'OTHER');

-- CreateEnum
CREATE TYPE "Fuel_Type" AS ENUM ('DIESEL', 'PETROL', 'CNG', 'ELECTRIC');

-- CreateEnum
CREATE TYPE "Trip_Status" AS ENUM ('SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'DELAYED');

-- CreateTable
CREATE TABLE "Users" (
    "id" SERIAL NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'VIEWER',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Trucks" (
    "id" SERIAL NOT NULL,
    "number" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "fuel_type" "Fuel_Type" NOT NULL DEFAULT 'DIESEL',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "current_status" "Status" NOT NULL DEFAULT 'AVAILABLE',
    "created_by" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Trucks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Drivers" (
    "id" SERIAL NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "license_number" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_by" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Drivers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Clients" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "contact_person" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_by" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Clients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Trips" (
    "id" SERIAL NOT NULL,
    "client_id" INTEGER NOT NULL,
    "driver_id" INTEGER NOT NULL,
    "truck_id" INTEGER NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3),
    "origin_address" TEXT NOT NULL,
    "destination_address" TEXT NOT NULL,
    "base_revenue" DOUBLE PRECISION NOT NULL,
    "additional_charges" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "status" "Trip_Status" NOT NULL,
    "created_by" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Trips_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TripExpenses" (
    "id" SERIAL NOT NULL,
    "trip_id" INTEGER NOT NULL,
    "type" "Expense_Type" NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "description" TEXT NOT NULL,
    "receipt_number" TEXT,
    "vendor_name" TEXT,
    "expense_date" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TripExpenses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- CreateIndex
CREATE INDEX "Users_role_idx" ON "Users"("role");

-- CreateIndex
CREATE INDEX "Users_is_active_idx" ON "Users"("is_active");

-- CreateIndex
CREATE UNIQUE INDEX "Trucks_number_key" ON "Trucks"("number");

-- CreateIndex
CREATE INDEX "Trucks_current_status_idx" ON "Trucks"("current_status");

-- CreateIndex
CREATE INDEX "Trucks_is_active_idx" ON "Trucks"("is_active");

-- CreateIndex
CREATE INDEX "Trucks_created_by_idx" ON "Trucks"("created_by");

-- CreateIndex
CREATE UNIQUE INDEX "Drivers_license_number_key" ON "Drivers"("license_number");

-- CreateIndex
CREATE INDEX "Drivers_license_number_idx" ON "Drivers"("license_number");

-- CreateIndex
CREATE INDEX "Drivers_is_active_idx" ON "Drivers"("is_active");

-- CreateIndex
CREATE INDEX "Drivers_created_by_idx" ON "Drivers"("created_by");

-- CreateIndex
CREATE UNIQUE INDEX "Clients_email_key" ON "Clients"("email");

-- CreateIndex
CREATE INDEX "Clients_is_active_idx" ON "Clients"("is_active");

-- CreateIndex
CREATE INDEX "Clients_created_by_idx" ON "Clients"("created_by");

-- CreateIndex
CREATE INDEX "Trips_client_id_idx" ON "Trips"("client_id");

-- CreateIndex
CREATE INDEX "Trips_driver_id_idx" ON "Trips"("driver_id");

-- CreateIndex
CREATE INDEX "Trips_truck_id_idx" ON "Trips"("truck_id");

-- CreateIndex
CREATE INDEX "Trips_created_by_idx" ON "Trips"("created_by");

-- CreateIndex
CREATE INDEX "Trips_status_idx" ON "Trips"("status");

-- CreateIndex
CREATE INDEX "Trips_start_date_idx" ON "Trips"("start_date");

-- CreateIndex
CREATE INDEX "Trips_status_start_date_idx" ON "Trips"("status", "start_date");

-- CreateIndex
CREATE INDEX "Trips_truck_id_status_idx" ON "Trips"("truck_id", "status");

-- CreateIndex
CREATE INDEX "TripExpenses_trip_id_idx" ON "TripExpenses"("trip_id");

-- CreateIndex
CREATE INDEX "TripExpenses_expense_date_idx" ON "TripExpenses"("expense_date");

-- CreateIndex
CREATE INDEX "TripExpenses_type_idx" ON "TripExpenses"("type");

-- AddForeignKey
ALTER TABLE "Trucks" ADD CONSTRAINT "Trucks_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Drivers" ADD CONSTRAINT "Drivers_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Clients" ADD CONSTRAINT "Clients_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trips" ADD CONSTRAINT "Trips_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "Clients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trips" ADD CONSTRAINT "Trips_driver_id_fkey" FOREIGN KEY ("driver_id") REFERENCES "Drivers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trips" ADD CONSTRAINT "Trips_truck_id_fkey" FOREIGN KEY ("truck_id") REFERENCES "Trucks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trips" ADD CONSTRAINT "Trips_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TripExpenses" ADD CONSTRAINT "TripExpenses_trip_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "Trips"("id") ON DELETE CASCADE ON UPDATE CASCADE;
