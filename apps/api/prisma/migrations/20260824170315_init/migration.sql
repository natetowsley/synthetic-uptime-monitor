-- CreateEnum
CREATE TYPE "HttpMethod" AS ENUM ('GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE');

-- CreateEnum
CREATE TYPE "FailureReason" AS ENUM ('TIMEOUT', 'CONNECTION_ERROR', 'UNEXPECTED_RESPONSE', 'UNKNOWN_ERROR');

-- CreateTable
CREATE TABLE "Endpoint" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "method" "HttpMethod" NOT NULL,
    "headers" JSONB,
    "body" JSONB,
    "expectedCode" INTEGER NOT NULL,
    "intervalMs" INTEGER NOT NULL DEFAULT 60000,
    "timeoutMs" INTEGER NOT NULL DEFAULT 10000,
    "isPaused" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Endpoint_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProbeResult" (
    "id" TEXT NOT NULL,
    "endpointId" TEXT NOT NULL,
    "actualCode" INTEGER,
    "failureReason" "FailureReason",
    "errorDetails" TEXT,
    "responseTimeMs" INTEGER,
    "isSuccess" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProbeResult_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ProbeResult_endpointId_createdAt_idx" ON "ProbeResult"("endpointId", "createdAt");

-- AddForeignKey
ALTER TABLE "ProbeResult" ADD CONSTRAINT "ProbeResult_endpointId_fkey" FOREIGN KEY ("endpointId") REFERENCES "Endpoint"("id") ON DELETE CASCADE ON UPDATE CASCADE;
