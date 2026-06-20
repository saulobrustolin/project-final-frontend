import { Card, CardContent, CardTitle } from "~/components/ui/card";
import getBudgetsQuery from "~/queries/getBudgetQuery";
import type { Route } from "./+types/budgets";
import { Skeleton } from "~/components/ui/skeleton";
import { Loader, Plus, Pointer } from "lucide-react";
import type { Budget } from "~/lib/types";
import ButtonDrawer from "~/components/button-drawer";
import { Controller, useForm } from "react-hook-form";
import { budgetSchema, type BudgetData } from "~/schemas/budgetSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState, type SyntheticEvent } from "react";
import { DrawerContent } from "~/components/ui/drawer";
import { Field, FieldError, FieldLabel, FieldSet } from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import { NumericFormat } from "react-number-format";
import { Button } from "~/components/ui/button";
import useCreateBudget from "~/queries/createBudgetQuery";
import { toast } from "sonner";
import useDeleteBudget from "~/queries/deleteBudgetQuery";
import useUpdateBudget from "~/queries/updateBudgetQuery";
import Alert from "~/components/alert";
import { format } from "date-fns";

export function meta({ }: Route.MetaArgs) {
    return [
        { title: "caixinha | budgets" },
        { name: "description", content: "Bem-vindo a página de budgets do seu sistema de controle financeiro." },
    ];
}

const Budgets = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);

    const budgets = getBudgetsQuery();
    const budgetCreate = useCreateBudget();
    const budgetDelete = useDeleteBudget();
    const budgetUpdate = useUpdateBudget();

    const {
        register,
        control,
        handleSubmit,
        reset,
        watch,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(budgetSchema),
        defaultValues: {
            description: '',
            target: 0,
            balance: 0,
            createdAt: new Date()
        }
    });

    const submitCreateBudget = async (data: BudgetData) => {
        await budgetCreate.mutateAsync(data, {
            onSuccess: () => {
                setIsOpen(false);
                toast.success("Budget criado com sucesso");
                reset({
            description: '',
            target: 0,
            balance: 0,
            createdAt: new Date()
        });
            },
            onError: () => toast.error("O servidor está em manutenção, tente novamente mais tarde...")
        });
    }

    const onAcceptDeleteTransaction = async () => {
        if (!watch("budgetId")) return;

        await budgetDelete.mutateAsync(watch("budgetId")!, {
            onSuccess: () => {
                toast.success("O budget foi deletado com sucesso");
                setIsOpen(false);
                reset({
            description: '',
            target: 0,
            balance: 0,
            createdAt: new Date()
        });
            },
            onError: () => {
                toast.error("O servidor está em manutenção, tente novamente mais tarde...");
            }
        })
    }

    const submitUpdateBudget = async (data: BudgetData) => {
        if (!data.budgetId?.length) return;

        await budgetUpdate.mutateAsync(data, {
            onSuccess: () => {
                toast.success("O budget foi atualizado com sucesso");
                setIsOpen(false);
                reset({
            description: '',
            target: 0,
            balance: 0,
            createdAt: new Date()
        });
            },
            onError: () => {
                toast.error("O servidor está em manutenção, tente novamente mais tarde...");
            }
        })
    }

    const handleEditBudget = (b: Budget) => {
        reset(b);
        setIsOpen(true);
    }

    const decisionFork = (data: BudgetData) => {
        data.budgetId?.length ? submitUpdateBudget(data) : submitCreateBudget(data);
    }

    useEffect(() => {
        if (!isOpen && !isDeleteDialogOpen) reset({
            description: '',
            target: 0,
            balance: 0,
            createdAt: new Date()
        });
    }, [isOpen, isDeleteDialogOpen])

    return (
        <>
            <ButtonDrawer
                title={{
                    name: "Criar novo budget",
                    icon: <Plus />
                }}
                titleClose="Fechar"
                open={isOpen}
                onOpenChange={setIsOpen}
                className="bg-green-dark text-white p-6 hover:bg-green-high hover:ring-4 hover:ring-neutral-100/25 hover:text-white"
            >
                <DrawerContent className="p-4 py-6">
                    <form id="budget-form" className="flex flex-col justify-between h-full" onSubmit={handleSubmit(decisionFork)}>
                        <div className="flex flex-col justify-between h-full gap-4">
                            <div>
                                <h1 className="mb-4 font-semibold text-lg">
                                    {watch("budgetId") ? "Editando budget" : "Criando um novo budget"}
                                </h1>
                                <Field>
                                    <FieldSet>
                                        <Field data-invalid={!!errors.description}>
                                            <FieldLabel htmlFor="description">Descrição</FieldLabel>
                                            <Input
                                                id="description"
                                                aria-invalid={!!errors.description}
                                                type="text"
                                                placeholder="Dê um nome a sua meta"
                                                {...register("description")}
                                            />
                                            <FieldError>
                                                {errors.description && <p className="text-destructive">{errors.description.message}</p>}
                                            </FieldError>
                                        </Field>
                                        <Field data-invalid={!!errors.description}>
                                            <FieldLabel htmlFor="target">Valor da meta (R$)</FieldLabel>
                                            <Controller
                                                name="target"
                                                control={control}
                                                render={({ field: { onChange, value } }) => (
                                                    <NumericFormat
                                                        customInput={Input}
                                                        id="target"
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
                                                {errors.target && <p className="text-destructive">{errors.target.message}</p>}
                                            </FieldError>
                                        </Field>
                                        <Field data-invalid={!!errors.balance}>
                                            <FieldLabel htmlFor="balance">Valor inicial (R$)</FieldLabel>
                                            <Controller
                                                name="balance"
                                                control={control}
                                                render={({ field: { onChange, value } }) => (
                                                    <NumericFormat
                                                        customInput={Input}
                                                        id="balance"
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
                                                {errors.balance && <p className="text-destructive">{errors.balance.message}</p>}
                                            </FieldError>
                                        </Field>
                                    </FieldSet>
                                </Field>
                            </div>
                            <div className="flex flex-col gap-1">
                                <Button type="submit" disabled={budgetCreate.isPending || budgetDelete.isPending} form="budget-form">
                                    {(budgetCreate.isPending || budgetDelete.isPending) ? <Loader className="animate-spin" /> : "Enviar budget"}
                                </Button>
                                {watch("budgetId") ? (
                                    <Button disabled={budgetCreate.isPending || budgetDelete.isPending} className="bg-red-400" onClick={(event: SyntheticEvent<HTMLButtonElement>) => {
                                        event.preventDefault();

                                        setIsDeleteDialogOpen(true);
                                    }}>
                                        {(budgetCreate.isPending || budgetDelete.isPending) ? <Loader className="animate-spin" /> : "Deletar budget"}
                                    </Button>
                                ) : null}
                            </div>
                        </div>
                    </form>
                </DrawerContent>
            </ButtonDrawer>
            <Card className="flex flex-col gap-4 ring-0 p-1">
                <CardTitle className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 h-10">
                    <span className="p-4">
                        budgets
                    </span>
                </CardTitle>
                <CardContent className="text-4xl font-bold p-0 flex flex-col gap-1">
                    {budgets.isLoading ? (
                        <Skeleton className="h-28 w-full rounded-md" />
                    ) : (
                        (budgets.data && budgets.data.length) ? budgets.data.map((b: Budget, index: number) => {
                            const percentil = (b.balance / b.target) * 100;

                            return (
                                <Card className="p-4 min-h-28 ring-0 relative cursor-pointer hover:bg-neutral-900/2" key={`${b.createdAt}-${b.description}-${index}`} onClick={() => handleEditBudget(b)}>
                                    <CardTitle className="flex justify-between">
                                        <div className="flex flex-col sm:flex-row sm:gap-1 sm:items-end">
                                            <span className="lowercase">
                                                {b.description}
                                            </span>
                                            <span className="text-black/75 text-xs">
                                                criado em {format(b.createdAt, "dd/MM/yyyy")}
                                            </span>
                                        </div>
                                        <span className="font-medium text-xs opacity-60">
                                            {percentil >= 100 ? (
                                                "concluído"
                                            ) : (
                                                `${percentil.toFixed(2)}% atingido`
                                            )}
                                        </span>
                                    </CardTitle>
                                    <CardContent className="text-4xl font-bold p-0">
                                        {budgets.isLoading ? (
                                            <Skeleton className="h-8 w-16 rounded-full" />
                                        ) : (
                                            <div className="flex justify-between items-end">
                                                <NumericFormat
                                                    value={b.target / 100}
                                                    thousandSeparator="."
                                                    decimalSeparator=","
                                                    prefix="R$ "
                                                    allowNegative={false}
                                                    fixedDecimalScale
                                                    decimalScale={2}
                                                    displayType="text"
                                                    style={{ textDecoration: percentil >= 100 ? 'line-through' : 'none', animation: percentil >= 100 ? 'ping 1s ease-in-out 1 forwards' : 'none' }}
                                                />
                                                <span className="text-xs flex gap-1 items-center justify-center opacity-50">
                                                    click me
                                                    <Pointer size={16} />
                                                </span>
                                            </div>
                                        )}
                                    </CardContent>
                                    <span className={`bg-green-high/20 absolute left-0 top-0 h-full`} style={{ width: `${percentil.toPrecision(2)}%` }} />
                                </Card>
                            )
                        }) : (
                            <p className="p-4 text-sm text-black/75 underline underline-offset-2">
                                não foi encontrado nenhum budget, ainda
                            </p>
                        )
                    )}
                </CardContent>
            </Card>

            <Alert
                title="Você tem certeza absoluta?"
                description="Esta ação não pode ser desfeita e excluirá permanentemente o registro."
                onCancel={() => setIsDeleteDialogOpen(false)}
                onAccept={onAcceptDeleteTransaction}
                isOpen={isDeleteDialogOpen}
                setIsOpen={setIsDeleteDialogOpen}
                loading={budgetDelete.isPending}
            />
        </>
    )
}

export default Budgets;