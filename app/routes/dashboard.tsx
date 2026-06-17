import { Card, CardContent, CardFooter, CardTitle } from "~/components/ui/card";
import type { Route } from "./+types/dashboard";
import { CalendarIcon, CircleArrowDown, CircleArrowUp, CircleMinus, MoreHorizontalIcon, Plus } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Field, FieldError, FieldLabel, FieldSet } from "~/components/ui/field";
import { NumberTicker } from "~/components/ui/number-ticker";
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover";
import { useEffect, useState } from "react";
import type { DateRange } from "react-day-picker";
import { addDays, format } from "date-fns";
import { Calendar } from "~/components/ui/calendar";
import { ptBR } from "date-fns/locale";
import resumeQuery from "~/queries/resumeQuery";
import { Skeleton } from "~/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "~/components/ui/dropdown-menu";
import ButtonDrawer from "~/components/button-drawer";
import { DrawerContent } from "~/components/ui/drawer";
import { Input } from "~/components/ui/input";
import type { ErrorField, TransactionForm } from "~/lib/types";
import { NumericFormat } from "react-number-format";
import { Combobox, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList } from "~/components/ui/combobox";
import { collections } from "~/lib/singleton";

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
  const [form, setForm] = useState<TransactionForm>({
    description: '',
    amount: 0,
    type: "INCOME",
    collection: 'Não específicado',
    date: new Date()
  });
  const [errors, setErrors] = useState<ErrorField[]>([]);

  const resume = resumeQuery(period);

  useEffect(() => {
    console.log(form.amount);
  }, [form.amount])

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
        <CardTitle className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4 min-h-28">
            <CardTitle className="flex justify-between">
              <span>
                Balanço geral
              </span>
              <CircleMinus className="text-neutral-400" width={20} />
            </CardTitle>
            <CardContent className="text-4xl font-bold p-0">
              {resume.isLoading ? (
                <Skeleton className="h-8 w-16 rounded-full" />
              ) : (
                resume.data?.balance ? <NumberTicker value={resume.data?.balance} /> : "R$ 0,00"
              )}
            </CardContent>
          </Card>
          <Card className="p-4 min-h-28">
            <CardTitle className="flex justify-between">
              <span>
                Entrada do período
              </span>
              <CircleArrowUp className="text-green-500" width={20} />
            </CardTitle>
            <CardContent className="text-4xl font-bold p-0 text-green-500">
              {resume.isLoading ? (
                <Skeleton className="h-8 w-16 rounded-full" />
              ) : (
                resume.data?.debit ? <NumberTicker value={resume.data?.debit} /> : "R$ 0,00"
              )}
            </CardContent>
          </Card>
          <Card className="p-4 min-h-28">
            <CardTitle className="flex justify-between">
              <span>
                Saída do período
              </span>
              <CircleArrowDown className="text-red-400" width={20} />
            </CardTitle>
            <CardContent className="text-4xl font-bold p-0 text-red-400">
              {resume.isLoading ? (
                <Skeleton className="h-8 w-16 rounded-full" />
              ) : (
                resume.data?.debit ? <NumberTicker value={resume.data?.credit} /> : "R$ 0,00"
              )}
            </CardContent>
          </Card>
          <Card className="p-4 min-h-28">
            <CardTitle className="flex justify-between">
              <span>
                Balanço do período
              </span>
              <CircleArrowDown className="text-amber-300" width={20} />
            </CardTitle>
            <CardContent className="text-4xl font-bold p-0 text-amber-300">
              {resume.isLoading ? (
                <Skeleton className="h-8 w-16 rounded-full" />
              ) : (
                resume.data?.net_balance ? <NumberTicker value={resume.data?.net_balance} /> : "R$ 0,00"
              )}
            </CardContent>
          </Card>
        </CardTitle>
        <CardContent className="p-0">
          <div className="grid grid-cols-2 gap-4">
            <ButtonDrawer
              title={{
                name: "Criar nova receita",
                icon: <Plus />
              }}
              titleClose="Fechar"
              onAction={() => setForm(v => ({ ...v, type: "INCOME" }))}
              className="bg-green-high text-white p-6 hover:bg-green-dark hover:ring-4 hover:ring-neutral-100/25 hover:text-white"
            >
              <DrawerContent className="p-4 py-6">
                <h1 className="mb-4 font-semibold text-lg">
                  Criando uma nova transação
                </h1>
                <Field>
                  <FieldSet>
                    <Field data-invalid={errors.some(error => error.field == "description")}>
                      <FieldLabel htmlFor="description">Descrição</FieldLabel>
                      <Input
                        aria-invalid={errors.some(error => error.field == "description")}
                        type="text"
                        defaultValue={form.description}
                        onBlur={event => setForm(v => ({ ...v, description: event.target.value }))}
                        id="description"
                      />
                      <FieldError>
                        {errors.filter(error => error.field == "description").map(error => {
                          return (
                            <p className="text-destructive" key={error.message}>{error.message}</p>
                          )
                        })}
                      </FieldError>
                    </Field>
                    <Field data-invalid={errors.some(error => error.field == "amount")}>
                      <FieldLabel htmlFor="amount">Preço (R$)</FieldLabel>
                      <NumericFormat
                        customInput={Input}
                        id="amount"
                        thousandSeparator="."
                        decimalSeparator=","
                        prefix="R$ "
                        decimalScale={2}
                        fixedDecimalScale
                        allowNegative={false}
                        value={(form.amount ?? 0) / 100}
                        onValueChange={values => setForm(v => ({ ...v, amount: (values.floatValue ? (values.floatValue * 100) : 0) }))}
                      />
                      <FieldError>
                        {errors.filter(error => error.field == "amount").map(error => {
                          return (
                            <p className="text-destructive" key={error.message}>{error.message}</p>
                          )
                        })}
                      </FieldError>
                    </Field>
                    <Field data-invalid={errors.some(error => error.field == "description")}>
                      <FieldLabel htmlFor="description">Coleção</FieldLabel>
                      <Combobox items={collections}>
                        <ComboboxInput placeholder="Selecione uma coleção" />
                        <ComboboxContent>
                          <ComboboxEmpty>Não foi encontrada nenhuma coleção.</ComboboxEmpty>
                          <ComboboxList>
                            {(item: string) => (
                              <ComboboxItem key={item} value={item}>
                                {item}
                              </ComboboxItem>
                            )}
                          </ComboboxList>
                        </ComboboxContent>
                      </Combobox>
                      <FieldError>
                        {errors.filter(error => error.field == "collection").map(error => {
                          return (
                            <p className="text-destructive" key={error.message}>{error.message}</p>
                          )
                        })}
                      </FieldError>
                    </Field>
                  </FieldSet>
                </Field>
              </DrawerContent>
            </ButtonDrawer>
            <ButtonDrawer
              title={{
                name: "Criar novo gasto",
                icon: <Plus />
              }}
              titleClose="Fechar"
              onAction={() => setForm(v => ({ ...v, type: "EXPENSE" }))}
              className="bg-red-400 text-white p-6 hover:bg-red-500 hover:ring-4 hover:ring-neutral-100/25 hover:text-white"
            >
              <DrawerContent className="p-4">

              </DrawerContent>
            </ButtonDrawer>
          </div>
        </CardContent>
        <CardFooter className="p-0">
          <Card className="p-4">
            <CardTitle>
              Transações
            </CardTitle>
            <CardContent className="p-0">
              {resume.isLoading ? (
                <Skeleton className="h-8 w-16 rounded-full" />
              ) : (
                resume.data?.transactions.length ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">Wireless Mouse</TableCell>
                        <TableCell>$29.99</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="size-8"><MoreHorizontalIcon /><span className="sr-only">Open menu</span></Button>} />
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>Edit</DropdownMenuItem>
                              <DropdownMenuItem>Duplicate</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem variant="destructive">
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Mechanical Keyboard</TableCell>
                        <TableCell>$129.99</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="size-8"><MoreHorizontalIcon /><span className="sr-only">Open menu</span></Button>} />
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>Edit</DropdownMenuItem>
                              <DropdownMenuItem>Duplicate</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem variant="destructive">
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">USB-C Hub</TableCell>
                        <TableCell>$49.99</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="size-8"><MoreHorizontalIcon /><span className="sr-only">Open menu</span></Button>} />
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>Edit</DropdownMenuItem>
                              <DropdownMenuItem>Duplicate</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem variant="destructive">
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                ) : "não há transações nesse período"
              )}
            </CardContent>
          </Card>
        </CardFooter>
      </Card>
    </>
  );
}

export default Dashboard;