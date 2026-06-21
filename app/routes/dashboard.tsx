import { Card, CardContent, CardFooter, CardTitle } from "~/components/ui/card";
import type { Route } from "./+types/dashboard";
import { CalendarIcon, ChevronDownIcon, CircleArrowDown, CircleArrowUp, CircleMinus, Loader, MoreHorizontalIcon, Plus } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Field, FieldError, FieldLabel, FieldSet } from "~/components/ui/field";
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
import { NumericFormat } from "react-number-format";
import { collections } from "~/lib/singleton";
import { transactionSchema, type TransactionData } from "~/schemas/transactionSchema";
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { NumberTicker } from "~/components/ui/number-ticket";
import { Select, SelectContent, SelectGroup, SelectTrigger, SelectValue } from "~/components/ui/select";
import SelectItemIcon from "~/components/select-item-icon";
import type { CollectionType } from "~/lib/types";
import createTransactionQuery from "~/queries/createTransactionQuery";
import { toast } from "sonner";
import Alert from "~/components/alert";
import useDeleteTransaction from "~/queries/deleteTransactionQuery";
import useUpdateTransaction from "~/queries/updateTransactionQuery";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "caixinha | página inicial" },
    { name: "description", content: "Bem-vindo a página inicial do seu sistema de controle financeiro." },
  ];
}

const Dashboard = () => {
  const [openCreateTransaction, setOpenCreateTransaction] = useState<boolean>(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState<boolean>(false);

  const [period, setPeriod] = useState<DateRange | undefined>({
    from: addDays(new Date(new Date()), -30),
    to: new Date(new Date()),
  });

  const resume = resumeQuery(period);
  const createTransaction = createTransactionQuery();
  const deleteTransaction = useDeleteTransaction();
  const updateTransaction = useUpdateTransaction();

  const {
    register,
    control,
    setValue,
    handleSubmit,
    reset,
    watch,
    formState: { errors }
  } = useForm<TransactionData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      description: '',
      amount: 0,
      collection: { name: 'Não específicado', icon: 'CircleQuestionMark' },
      date: new Date(),
      type: "INCOME"
    }
  });

  useEffect(() => {
    if (!openCreateTransaction && !isDeleteDialogOpen && !isUpdateDialogOpen) reset({
      description: '',
      amount: 0,
      collection: { name: 'Não específicado', icon: 'CircleQuestionMark' },
      date: new Date(),
      type: "INCOME"
    });
  }, [openCreateTransaction, isDeleteDialogOpen, isUpdateDialogOpen])

  const submitCreateTransaction = async (data: TransactionData) => {
    await createTransaction.mutate(data, {
      onSuccess: () => {
        toast.success("A transação foi criada com sucesso");
        setOpenCreateTransaction(false);
        reset({
          description: '',
          amount: 0,
          collection: { name: 'Não específicado', icon: 'CircleQuestionMark' },
          date: new Date(),
          type: "INCOME"
        });
      },
      onError: () => toast.error("O servidor está em manutenção no momento, tente novamente mais tarde...")
    });
  }

  const submitUpdateTransaction = async (data: TransactionData) => {
    await updateTransaction.mutate(data, {
      onSuccess: () => {
        toast.success("A transação foi editada com sucesso");
        setIsUpdateDialogOpen(false);
        reset({
          description: '',
          amount: 0,
          collection: { name: 'Não específicado', icon: 'CircleQuestionMark' },
          date: new Date(),
          type: "INCOME"
        });
      },
      onError: () => toast.error("O servidor está em manutenção no momento, tente novamente mais tarde...")
    });
  }

  const handleOpenDrawer = (type: "INCOME" | "EXPENSE") => {
    setValue("type", type);
    setOpenCreateTransaction(true);
  };

  const onAcceptDeleteTransaction = async () => {
    const transactionId = watch("transactionId");

    await deleteTransaction.mutateAsync(transactionId ?? '', {
      onSuccess: () => {
        toast.success("A transação foi deletada com sucesso");
        reset({
          description: '',
          amount: 0,
          collection: { name: 'Não específicado', icon: 'CircleQuestionMark' },
          date: new Date(),
          type: "INCOME"
        });
        setIsDeleteDialogOpen(false);
      },
      onError: () => toast.error("O servidor está em manutenção, tente novamente mais tarde...")
    });
  }

  return (
    <>
      <Card className="flex flex-col gap-4 bg-transparent ring-0 p-0.5">
        <Field className="w-60">
          <FieldLabel htmlFor="date-picker-range">Defina o período</FieldLabel>
          <Popover>
            <PopoverTrigger asChild >
              <Button variant="outline" id="date-picker-range" className="justify-start px-2.5 font-normal"><CalendarIcon data-icon="inline-start" />{period?.from ? (
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
              }</Button>
            </PopoverTrigger>
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
                resume.data?.balance ? <NumberTicker value={resume.data?.balance / 100} /> : "R$ 0,00"
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
                resume.data?.debit ? <NumberTicker value={resume.data?.debit / 100} /> : "R$ 0,00"
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
                resume.data?.debit ? <NumberTicker value={resume.data?.credit / 100} /> : "R$ 0,00"
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
                resume.data?.net_balance ? <NumberTicker value={resume.data?.net_balance / 100} /> : "R$ 0,00"
              )}
            </CardContent>
          </Card>
        </CardTitle>
        <CardContent className="p-0">
          <div className="grid grid-cols-2 gap-4">
            <Button
              onClick={() => handleOpenDrawer("INCOME")}
              className="bg-green-dark text-white p-6 hover:bg-green-high hover:ring-4 hover:ring-neutral-100/25 hover:text-white"
            >
              <Plus className="mr-2" />
              Criar nova receita
            </Button>

            <Button
              onClick={() => handleOpenDrawer("EXPENSE")}
              className="bg-red-400 text-white p-6 hover:bg-red-500 hover:ring-4 hover:ring-neutral-100/25 hover:text-white"
            >
              <Plus className="mr-2" />
              Criar novo gasto
            </Button>

            <ButtonDrawer
              title={{
                name: watch("type") === "INCOME" ? "Criar nova receita" : "Criar novo gasto",
                icon: <Plus />
              }}
              titleClose="Fechar"
              open={openCreateTransaction}
              onOpenChange={setOpenCreateTransaction}
              className="hidden bg-red-400 text-white p-6 hover:bg-red-500 hover:ring-4 hover:ring-neutral-100/25 hover:text-white"
            >
              <DrawerContent className="p-4 py-6">
                <form id="create-transaction-expense-form" className="flex flex-col justify-between h-full" onSubmit={handleSubmit(submitCreateTransaction)}>
                  <div className="flex flex-col justify-between h-full gap-4">
                    <div>
                      <h1 className="mb-4 font-semibold text-lg">
                        {watch("type") === "INCOME" ? "Criando nova receita" : "Criando novo gasto"}
                      </h1>
                      <Field>
                        <FieldSet>
                          <Field data-invalid={!!errors.description}>
                            <FieldLabel htmlFor="description">Descrição</FieldLabel>
                            <Input
                              id="description"
                              placeholder="Dê uma descrição a transação"
                              aria-invalid={!!errors.description}
                              type="text"
                              {...register("description")}
                            />
                            <FieldError>
                              {errors.description && <p className="text-destructive">{errors.description.message}</p>}
                            </FieldError>
                          </Field>
                          <Field data-invalid={!!errors.description}>
                            <FieldLabel htmlFor="amount">Preço (R$)</FieldLabel>
                            <Controller
                              name="amount"
                              control={control}
                              render={({ field: { onChange, value } }) => (
                                <NumericFormat
                                  customInput={Input}
                                  id="amount"
                                  thousandSeparator="."
                                  decimalSeparator=","
                                  prefix="R$ "
                                  decimalScale={2}
                                  fixedDecimalScale
                                  allowNegative={false}
                                  value={(value ?? 0) / 100}
                                  onValueChange={(values) => {
                                    onChange(values.floatValue ? values.floatValue * 100 : 0);
                                  }}
                                />
                              )}
                            />
                            <FieldError>
                              {errors.amount && <p className="text-destructive">{errors.amount.message}</p>}
                            </FieldError>
                          </Field>
                          <Field data-invalid={!!errors.collection}>
                            <FieldLabel htmlFor="collection">Coleção</FieldLabel>
                            <Controller
                              name="collection"
                              control={control}
                              render={({ field: { onChange, value } }) => (
                                <Select value={value.name} onValueChange={value => onChange(collections.get(value))} >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Escolha a coleção" />
                                  </SelectTrigger>
                                  <SelectContent position="popper">
                                    <SelectGroup>
                                      {Array.from(collections.entries()).map(([k, c]: [string, CollectionType]) => {
                                        return (
                                          <SelectItemIcon key={k} name={c.name} icon={c.icon} className={watch("type") === "INCOME" ? "bg-green-dark" : "bg-red-400"} />
                                        )
                                      })}
                                    </SelectGroup>
                                  </SelectContent>
                                </Select>
                              )}
                            />
                            <FieldError>
                              {errors.collection && <p className="text-destructive">{errors.collection.message}</p>}
                            </FieldError>
                          </Field>
                          <Field>
                            <FieldLabel>Data da transação</FieldLabel>
                            <Controller
                              name="date"
                              control={control}
                              render={({ field: { onChange, value } }) => (
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <Button
                                      variant="outline"
                                      data-empty={!value}
                                      className="justify-between text-left font-normal data-[empty=true]:text-muted-foreground"
                                    >
                                      {value ? format(value, "dd/MM/yyyy") : <span>Escolha a data da movimentação</span>}
                                      <ChevronDownIcon />
                                    </Button>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                      mode="single"
                                      selected={value}
                                      onSelect={onChange}
                                      defaultMonth={value}
                                      locale={ptBR}
                                    />
                                  </PopoverContent>
                                </Popover>
                              )}
                            />
                            <FieldError></FieldError>
                          </Field>
                        </FieldSet>
                      </Field>
                    </div>
                    <Button type="submit" disabled={createTransaction.isPending} form="create-transaction-expense-form">
                      {createTransaction.isPending ? <Loader className="animate-spin" /> : "Enviar transação"}
                    </Button>
                  </div>
                </form>
              </DrawerContent>
            </ButtonDrawer>
          </div>
        </CardContent>
        <CardFooter className="p-0">
          <Card className="p-4 w-full">
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
                      <TableRow className="bg-transparent">
                        <TableHead className="font-bold">Descrição</TableHead>
                        <TableHead className="font-bold">Preço</TableHead>
                        <TableHead className="font-bold hidden md:table-cell">Coleção</TableHead>
                        <TableHead className="font-bold">Data</TableHead>
                        <TableHead className="text-right font-bold">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {resume.data.transactions.map(transaction => {
                        return (
                          <TableRow key={transaction.transactionId}>
                            <TableCell className="font-medium truncate" aria-label={transaction.description}>{transaction.description}</TableCell>
                            <TableCell className={transaction.type === "INCOME" ? "text-green-dark" : "text-red-400"}>
                              <NumericFormat
                                value={transaction.amount / 100}
                                thousandSeparator="."
                                decimalSeparator=","
                                prefix="R$ "
                                allowNegative={false}
                                fixedDecimalScale
                                decimalScale={2}
                                displayType="text"
                              />
                            </TableCell>
                            <TableCell className="font-medium truncate hidden md:block" aria-label={collections.get(transaction.collection.name)?.name || 'Não especificado'}>{collections.get(transaction.collection.name)?.name || 'Não especificado'}</TableCell>
                            <TableCell className="font-medium truncate" aria-label={format(transaction.date, 'dd/MM/yyyy')}>{format(transaction.date, 'dd/MM/yyyy')}</TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild >
                                  <Button variant="ghost" size="icon" className="size-8">
                                    <MoreHorizontalIcon />
                                    <span className="sr-only"></span>
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem
                                    onSelect={e => {
                                      e.preventDefault();
                                      const t = { ...transaction, collection: collections.get(transaction.collection.name), date: new Date(transaction.date) };
                                      reset(t);
                                      setIsUpdateDialogOpen(true);
                                    }}
                                  >
                                    Editar
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem variant="destructive"
                                    onSelect={e => {
                                      e.preventDefault();
                                      const t = { ...transaction, collection: collections.get(transaction.collection.name) };
                                      reset(t);
                                      setIsDeleteDialogOpen(true);
                                    }}
                                  >
                                    Deletar
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                ) : <p className="text-black/75 underline underline-offset-2">não há transações nesse período</p>
              )}
            </CardContent>
          </Card>
        </CardFooter>
      </Card>

      <Alert
        title="Você tem certeza absoluta?"
        description="Esta ação não pode ser desfeita e excluirá permanentemente o registro."
        onCancel={() => setOpenCreateTransaction(false)}
        onAccept={onAcceptDeleteTransaction}
        isOpen={isDeleteDialogOpen}
        setIsOpen={setIsDeleteDialogOpen}
        loading={deleteTransaction.isPending}
      />

      <ButtonDrawer
        title={{
          name: "Criar novo gasto",
          icon: <Plus />
        }}
        titleClose="Fechar"
        onAction={() => setValue("type", "EXPENSE")}
        open={isUpdateDialogOpen}
        onOpenChange={setIsUpdateDialogOpen}
        className="bg-red-400 hidden text-white p-6 hover:bg-red-500 hover:ring-4 hover:ring-neutral-100/25 hover:text-white"
      >
        <DrawerContent className="p-4 py-6">
          <form id="update-transaction-form" className="flex flex-col justify-between h-full" onSubmit={handleSubmit(submitUpdateTransaction)}>
            <div className="flex flex-col justify-between h-full gap-4">
              <div>
                <h1 className="mb-4 font-semibold text-lg">
                  Editando transação
                </h1>
                <Field>
                  <FieldSet>
                    <Field data-invalid={!!errors.description}>
                      <FieldLabel htmlFor="description">Descrição</FieldLabel>
                      <Input
                        id="description"
                        aria-invalid={!!errors.description}
                        type="text"
                        {...register("description")}
                      />
                      <FieldError>
                        {errors.description && <p className="text-destructive">{errors.description.message}</p>}
                      </FieldError>
                    </Field>
                    <Field data-invalid={!!errors.description}>
                      <FieldLabel htmlFor="amount">Preço (R$)</FieldLabel>
                      <Controller
                        name="amount"
                        control={control}
                        render={({ field: { onChange, value } }) => (
                          <NumericFormat
                            customInput={Input}
                            id="amount"
                            thousandSeparator="."
                            decimalSeparator=","
                            prefix="R$ "
                            decimalScale={2}
                            fixedDecimalScale
                            allowNegative={false}
                            value={(value ?? 0) / 100}
                            onValueChange={(values) => {
                              onChange(values.floatValue ? values.floatValue * 100 : 0);
                            }}
                          />
                        )}
                      />
                      <FieldError>
                        {errors.amount && <p className="text-destructive">{errors.amount.message}</p>}
                      </FieldError>
                    </Field>
                    <Field data-invalid={!!errors.collection}>
                      <FieldLabel htmlFor="collection">Coleção</FieldLabel>
                      <Controller
                        name="collection"
                        control={control}
                        render={({ field: { onChange, value } }) => (
                          <Select value={value.name} onValueChange={value => onChange(collections.get(value))} >
                            <SelectTrigger>
                              <SelectValue placeholder="Escolha a coleção" />
                            </SelectTrigger>
                            <SelectContent position="popper">
                              <SelectGroup>
                                {Array.from(collections.entries()).map(([k, c]: [string, CollectionType]) => {
                                  return (
                                    <SelectItemIcon key={k} name={c.name} icon={c.icon} className={watch("type") === "INCOME" ? "bg-green-dark" : "bg-red-400"} />
                                  )
                                })}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        )}
                      />
                      <FieldError>
                        {errors.collection && <p className="text-destructive">{errors.collection.message}</p>}
                      </FieldError>
                    </Field>
                    <Field>
                      <FieldLabel>Data da transação</FieldLabel>
                      <Controller
                        name="date"
                        control={control}
                        render={({ field: { onChange, value } }) => (
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                data-empty={!value}
                                className="justify-between text-left font-normal data-[empty=true]:text-muted-foreground"
                              >
                                {value ? format(value, "dd/MM/yyyy") : <span>Escolha a data da movimentação</span>}
                                <ChevronDownIcon />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={value}
                                onSelect={onChange}
                                defaultMonth={value}
                                locale={ptBR}
                              />
                            </PopoverContent>
                          </Popover>
                        )}
                      />
                      <FieldError></FieldError>
                    </Field>
                  </FieldSet>
                </Field>
              </div>
              <Button type="submit" disabled={createTransaction.isPending} form="update-transaction-form">
                {createTransaction.isPending ? <Loader className="animate-spin" /> : "Enviar transação"}
              </Button>
            </div>
          </form>
        </DrawerContent>
      </ButtonDrawer>
    </>
  );
}

export default Dashboard;