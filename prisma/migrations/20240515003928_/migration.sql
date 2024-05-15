/*
  Warnings:

  - A unique constraint covering the columns `[name,description,photo]` on the table `Pet` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Pet_name_description_photo_key" ON "Pet"("name", "description", "photo");
