"use client";

import { type QuizAnswers } from "@/lib/types";
import { CheckCircle2 } from "lucide-react";
import Logo from "../Logo";

interface Props {
  answers: QuizAnswers;
}

export default function Screen18Result({ answers }: Props) {
  return (
    <div className="flex flex-col items-center py-8 pb-12 gap-8 text-center">
      <div className="flex justify-center pt-4">
        <Logo size="md" />
      </div>

      <div
        className="w-full rounded-2xl px-5 py-8 md:p-8 flex flex-col items-center gap-5"
        style={{
          backgroundColor: "var(--color-surface)",
          border: "1px solid var(--color-border)",
        }}
      >
        <CheckCircle2
          size={48}
          aria-hidden="true"
          style={{ color: "var(--color-accent)" }}
        />
        <h1
          className="text-2xl md:text-3xl font-bold leading-tight"
          style={{ color: "var(--color-text)" }}
        >
          {answers.firstName}, obrigado por responder a essas perguntas!
        </h1>
        <p
          className="text-base leading-relaxed max-w-lg"
          style={{ color: "var(--color-text-secondary)" }}
        >
          Em breve, nosso time entrará em contato para agendar sua reunião de
          consultoria e apresentar o sistema de aquisição de novos clientes.
        </p>
      </div>
    </div>
  );
}
