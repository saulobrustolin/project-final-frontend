import { Card, CardContent, CardFooter, CardTitle } from "~/components/ui/card";
import type { Route } from "./+types/dashboard";
import { CalendarIcon, CircleArrowDown, CircleArrowUp, CircleMinus, Plus } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Field, FieldLabel } from "~/components/ui/field";
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover";
import { useState } from "react";
import type { DateRange } from "react-day-picker";
import { addDays, format } from "date-fns";
import { Calendar } from "~/components/ui/calendar";
import { ptBR } from "date-fns/locale";
import type { TransactionItem } from "~/lib/types";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "caixinha | página inicial" },
    { name: "description", content: "Bem-vindo a página inicial do seu sistema de controle financeiro." },
  ];
}

const Dashboard = () => {
  const [period, setPeriod] = useState<DateRange | undefined>({
    from: new Date(new Date().getFullYear(), 0, 20),
    to: addDays(new Date(new Date().getFullYear(), 0, 20), 20),
  });
  const [transactions, setTransaction] = useState<TransactionItem[]>([]);

  return (
    <>
      <Card className="flex flex-col gap-4 bg-transparent ring-0 p-0.5">
        <Field className="w-60">
          <FieldLabel htmlFor="date-picker-range">Defina o período</FieldLabel>
          <Popover>
            <PopoverTrigger render={<Button variant="outline" id="date-picker-range" className="justify-start px-2.5 font-normal"><CalendarIcon data-icon="inline-start" />{period?.from ? (
                  period.to ? (
                    <>
                      {format(period.from, "dd/MM/yyyy")} -{" "}
                      {format(period.to, "dd/MM/yyyy")}
                    </>
                  ) : (
                    format(period.from, "dd/MM/yyyy")
                  )
                ) : (
                  <span>Escolha o período</span>
                )
            }</Button>} />
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="range"
                defaultMonth={period?.from}
                selected={period}
                onSelect={setPeriod}
                numberOfMonths={2}
                locale={ptBR}
              />
            </PopoverContent>
          </Popover>
        </Field>
        <CardTitle className="grid grid-cols-3 gap-4">
          <Card className="p-4">
            <CardTitle className="flex justify-between">
              <span>
                Balanço geral
              </span>
              <CircleMinus className="text-neutral-400" width={20} />
            </CardTitle>
            <CardContent className="text-4xl font-bold p-0">
              R$ 12,90
            </CardContent>
          </Card>
          <Card className="p-4">
            <CardTitle className="flex justify-between">
              <span>
                Entrada do período
              </span>
              <CircleArrowUp className="text-green-500" width={20} />
            </CardTitle>
            <CardContent className="text-4xl font-bold p-0 text-green-500">
              R$ 12,90
            </CardContent>
          </Card>
          <Card className="p-4">
            <CardTitle className="flex justify-between">
              <span>
                Saída do período
              </span>
              <CircleArrowDown className="text-red-400" width={20} />
            </CardTitle>
            <CardContent className="text-4xl font-bold p-0 text-red-400">
              R$ 12,90
            </CardContent>
          </Card>
        </CardTitle>
        <CardContent className="p-0">
          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" className="bg-green-high text-white p-6 flex gap-2 items-center">
              <Plus />
              Criar nova receita
            </Button>
            <Button variant="outline" className="bg-red-400 text-white p-6 hover:bg-red-500 hover:ring-4 hover:ring-neutral-100/25 hover:text-white">
              <Plus />
              Criar novo gasto
            </Button>
          </div>
        </CardContent>
        <CardFooter className="p-0">
          <Card className="p-4">
            <CardTitle>
              Transações
            </CardTitle>
            <CardContent className="p-0">

            </CardContent>
          </Card>
        </CardFooter>
      </Card>
    </>
  );
}

export default Dashboard;