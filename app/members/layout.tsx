import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "家族成员",
  description: "认识我们的家族成员，每一位家人都是传承的力量。",
  openGraph: {
    title: "家族成员 - 家族传承",
    description: "认识我们的家族成员，每一位家人都是传承的力量。",
  },
};

export default function MembersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
