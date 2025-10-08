"use client"

import * as React from "react"
import { CalendarIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

// Formata a data no padrão desejado
function formatDate(date: Date | undefined) {
  if (!date) return ""

  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  })
}

export function Calendar28() {
  const today = new Date() // Data fixa: hoje
  const [open, setOpen] = React.useState(false)

  return (
    <div className="flex flex-col gap-3">
      <Label htmlFor="date" className="px-1">
        Data de Hoje:
      </Label>
      <div className="relative flex gap-2">
        {/* Input somente leitura */}
        <Input
          id="date"
          value={formatDate(today)}
          readOnly
          className="bg-background pr-10 cursor-not-allowed"
        />

        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              id="date-picker"
              variant="ghost"
              className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
            >
              <CalendarIcon className="size-3.5" suppressHydrationWarning/>
              <span className="sr-only">Data de Hoje</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-auto overflow-hidden p-0"
            align="end"
            alignOffset={-8}
            sideOffset={10}
          >
            {/* Calendário fixo, sem possibilidade de mudar a seleção */}
            <Calendar
              mode="single"
              selected={today}
              month={today}
              disabled // impede qualquer interação
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}
