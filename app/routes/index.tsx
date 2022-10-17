import { Anchor, Box, Divider, Group, Image, Paper, SimpleGrid, Stack, Text, Title } from "@mantine/core";
import { StandardLayout } from "~/layout/StandardLayout";
import { useLoaderData } from "@remix-run/react";
import { Fragment, PropsWithChildren } from "react";
import { details } from "~/data/details";
import { badgeType, Category } from "~/util/interface/BadgeType";
import { categories, updateCategories } from "~/util/categories.server";

interface LoaderResult {
    "categories": Category[]
}

const rawPrefix = "https://raw.githubusercontent.com/intergrav/devins-badges/v2/assets";

function DarkPaper({ children }: PropsWithChildren) {
    return (
        <Paper p="md" withBorder sx={theme => ({
            "background": theme.colors.dark[9]
        })}>
            {children}
        </Paper>
    );
}

export async function loader({ context }): Promise<LoaderResult> {
    if (!categories) {
        await updateCategories(context.GITHUB_TOKEN);
    }

    return {
        categories
    };
}

export default function IndexPage() {
    const data = useLoaderData<LoaderResult>();

    return (
        <StandardLayout>
            <Stack>
                <DarkPaper>
                    <Stack>
                        <Title align="center" color="orange" sx={theme => ({
                            "fontSize": theme.fontSizes.xl * 2
                        })}>Devin's Badges</Title>
                        <Text size="lg" align="center">An easily browsable index of <Anchor href={details.links.devin}>Devin's Badges</Anchor>.</Text>
                        <Text color="dimmed" align="center">All content is dynamically generated. That explains any naming oddities!</Text>
                    </Stack>
                </DarkPaper>
                <Stack spacing="xl">
                    {data.categories.map(category => (
                        <Stack key={category.value}>
                            <Title align="center">{category.label}</Title>
                            <SimpleGrid cols={3} verticalSpacing="xl">
                                {category.files.map(file => (
                                    <DarkPaper key={file.value}>
                                        <Stack>
                                            <Stack spacing={2.5}>
                                                <Text color="white" weight="bold" size="lg">{file.label}</Text>
                                                <Text color="dimmed">{file.value}</Text>
                                            </Stack>
                                            <Group noWrap>
                                                {badgeType.map(type => {
                                                    const url = `${rawPrefix}/${type}/${file.url}`;

                                                    return (
                                                        <Anchor key={type} unstyled href={url} sx={{
                                                            "width": "100%",
                                                            "height": "100%"
                                                        }}>
                                                            <Image src={url} />
                                                        </Anchor>
                                                    );
                                                })}
                                            </Group>
                                        </Stack>
                                    </DarkPaper>
                                ))}
                            </SimpleGrid>
                        </Stack>
                    ))}
                </Stack>
                <Text color="dimmed" align="center">All images displayed are copyright (c) 2022 UltraStorm</Text>
            </Stack>
        </StandardLayout>
    );
}

