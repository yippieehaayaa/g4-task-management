import { type OtpPurpose, prisma } from "../client";

type CreateOtpInput = {
  code: string;
  purpose: OtpPurpose;
  identityId: string;
  expiresInMinutes?: number;
};

type VerifyOtpInput = {
  identityId: string;
  code: string;
  purpose: OtpPurpose;
};

const MAX_ATTEMPTS = 5;

const createOtp = async (input: CreateOtpInput) => {
  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + (input.expiresInMinutes ?? 5));

  await prisma.otp.updateMany({
    where: {
      identityId: input.identityId,
      purpose: input.purpose,
      status: "PENDING",
    },
    data: { status: "EXPIRED" },
  });

  return await prisma.otp.create({
    data: {
      code: input.code,
      purpose: input.purpose,
      expiresAt,
      identityId: input.identityId,
    },
  });
};

const verifyOtp = async (input: VerifyOtpInput) => {
  return await prisma.$transaction(async (tx) => {
    const otp = await tx.otp.findFirst({
      where: {
        identityId: input.identityId,
        purpose: input.purpose,
        status: "PENDING",
      },
      orderBy: { sentAt: "desc" },
    });

    if (!otp) {
      throw new Error("OTP not found");
    }

    if (otp.expiresAt < new Date()) {
      await tx.otp.update({
        where: { id: otp.id },
        data: { status: "EXPIRED" },
      });
      throw new Error("OTP expired");
    }

    if (otp.attempts >= MAX_ATTEMPTS) {
      await tx.otp.update({
        where: { id: otp.id },
        data: { status: "EXPIRED" },
      });
      throw new Error("Maximum attempts exceeded");
    }

    if (otp.code !== input.code) {
      await tx.otp.update({
        where: { id: otp.id },
        data: { attempts: { increment: 1 } },
      });
      throw new Error("Invalid OTP");
    }

    return await tx.otp.update({
      where: { id: otp.id },
      data: { status: "VERIFIED", verifiedAt: new Date() },
    });
  });
};

const findPendingOtp = async (identityId: string, purpose: OtpPurpose) => {
  return await prisma.otp.findFirst({
    where: {
      identityId,
      purpose,
      status: "PENDING",
      expiresAt: { gt: new Date() },
    },
    orderBy: { sentAt: "desc" },
  });
};

const expireOtpsByIdentity = async (identityId: string) => {
  return await prisma.otp.updateMany({
    where: { identityId, status: "PENDING" },
    data: { status: "EXPIRED" },
  });
};

export { createOtp, verifyOtp, findPendingOtp, expireOtpsByIdentity };
