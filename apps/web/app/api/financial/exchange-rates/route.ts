import { NextResponse } from "next/server";
import { VERIFIED_EXCHANGE_RATES } from "@abroadmate/shared";

export async function GET() {
  return NextResponse.json({
    success: true,
    data: VERIFIED_EXCHANGE_RATES,
    disclaimerBn:
      "সকল মুদ্রা বিনিময় হার বাংলাদেশ ব্যাংকের অফিসিয়াল ও উন্মুক্ত বাজার মিড-রেফারেন্স অনুযায়ী প্রদর্শিত। আন্তর্জাতিক লেনদেনের সময় কার্ড বা ব্যাংকভেদে ১-২% পার্থক্য হতে পারে।",
  });
}
