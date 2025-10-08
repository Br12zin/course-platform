"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function CoursePage() {
  const params = useParams();
  const id = params?.id as string;

  return (
    <div className="p-8 space-y-6">
      {/* Botão voltar */}
      <Button variant="ghost" asChild className="text-white hover:text-white/80">
        <Link href="/courses">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar para Cursos
        </Link>
      </Button>

      {/* Conteúdo do curso */}
      <Card>
        <CardHeader>
          <CardTitle>Detalhes do Curso {id}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Aqui você verá o conteúdo detalhado do curso de ID: {id}.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
