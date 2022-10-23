import { Accordion, ActionIcon, Anchor, Code, Container, Group, Image, Modal, Paper, SimpleGrid, Stack, Tabs, Text, TextInput, Title, useMantineTheme } from "@mantine/core";
import { StandardLayout } from "~/layout/StandardLayout";
import { useLoaderData } from "@remix-run/react";
import { PropsWithChildren, useState } from "react";
import { details } from "~/data/details";
import { BadgeType, badgeType, Category, File } from "~/util/interface/BadgeType";
import { categories, updateCategories } from "~/util/categories.server";
import { useDisclosure, useMediaQuery, useSetState } from "@mantine/hooks";
import { IconBrandHtml5, IconCode, IconMarkdown, IconSearch } from "@tabler/icons";
import { config } from "~/data/config";
import { Prism } from "@mantine/prism";
import LazyLoad, { forceCheck } from "react-lazyload";

// TODO:
// - Search
// - Container
// - Fix copy modal mobile
// - Improve prism visuals
// - So much cleanup
// - Fix lazyload not loading images on tab change

interface SelectedStorage {
    "type"?: BadgeType,
    "file"?: File,
    "url"?: string
}

interface SelectedTabs {
    [category: string]: {
        [file: string]: BadgeType
    }
}

interface URLs {
    [category: string]: {
        [file: string]: {
            [key in BadgeType]: string
        }
    }
}

interface LoaderResult {
    "categories": Category[],
    "urls": URLs
}

const rawPrefix = "https://cdn.jsdelivr.net/gh/intergrav/devins-badges/assets";

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

    const urls: URLs = {};
    for (const category of categories) {
        if (!urls[category.value]) {
            urls[category.value] = {};
        }

        for (const file of category.files) {
            if (!urls[category.value][file.value]) {
                urls[category.value][file.value] = {};
            }

            for (const type of badgeType) {
                urls[category.value][file.value][type] = `${rawPrefix}/${type}/${file.url}`;
            }
        }
    }

    return {
        categories,
        urls
    };
}

export default function IndexPage() {
    const data = useLoaderData<LoaderResult>();

    const theme = useMantineTheme();
    const largeScreen = useMediaQuery("(min-width: 800px)");

    const [opened, openedHandler] = useDisclosure(false);

    const [selectedStorage, setSelectedStorage] = useSetState<SelectedStorage>({});
    const [selectedTabs, setSelectedTabs] = useSetState<SelectedTabs>({});

    const [snippetTab, setSnippetTab] = useState("markdown");

    return (
        <>
            <StandardLayout>
                <Stack>
                    <DarkPaper>
                        <Stack>
                            <Title align="center" color="orange" sx={{
                                "fontSize": theme.fontSizes.xl * 2
                            }}>{details.name}</Title>
                            <Text size="lg" align="center">An easily browsable index of <Anchor href={details.links.devin}>Devin's Badges</Anchor>.</Text>
                            <Text color="dimmed" align="center">All content is dynamically generated. That explains any naming oddities!</Text>
                        </Stack>
                    </DarkPaper>
                    <Group>
                        <TextInput disabled placeholder="Search" sx={{
                            "flexGrow": 1
                        }} />
                        <ActionIcon disabled variant="filled" color={config.accentColor} size="lg">
                            <IconSearch />
                        </ActionIcon>
                    </Group>
                    <Accordion variant="filled" multiple transitionDuration={0} onChange={() => {
                        forceCheck();
                    }} styles={{
                        "control": {
                            "borderRadius": theme.radius.md,
                            ":hover": {
                                "background": theme.colors.dark[6]
                            }
                        },
                        "item": {
                            "background": "unset !important"
                        },
                        "content": {
                            "paddingLeft": 0,
                            "paddingRight": 0
                        }
                    }}>
                        {data.categories.map(category => (
                            <Accordion.Item key={category.value} id={category.value} value={category.value}>
                                <Accordion.Control>
                                    <Title order={3}>{category.label}</Title>
                                </Accordion.Control>
                                <Accordion.Panel>
                                    <SimpleGrid cols={largeScreen ? 3 : undefined} verticalSpacing="xl">
                                        {category.files.map(file => (
                                            <LazyLoad key={file.value}>
                                                <DarkPaper>
                                                    <Stack>
                                                        <Group noWrap>
                                                            <Image src={data.urls[category.value][file.value].minimal} width={theme.spacing.xs * 5} />
                                                            <Stack spacing={2.5}>
                                                                <Text color="white" weight="bold" size="lg">{file.label}</Text>
                                                                <Text color="dimmed">{file.value}</Text>
                                                            </Stack>
                                                        </Group>
                                                        <Tabs defaultValue={badgeType[0]} variant="pills" onTabChange={value => {
                                                            if (!value) {
                                                                return;
                                                            }

                                                            setSelectedTabs({
                                                                [category.value]: {
                                                                    [file.value]: value as BadgeType
                                                                }
                                                            });

                                                            forceCheck();
                                                        }}>
                                                            <Group>
                                                                <Tabs.List grow sx={{
                                                                    "flexGrow": 1
                                                                }}>
                                                                    {badgeType.map(type => (
                                                                        <Tabs.Tab key={type} value={type}>
                                                                            {type}
                                                                        </Tabs.Tab>
                                                                    ))}
                                                                </Tabs.List>
                                                                <ActionIcon color={config.accentColor} variant="filled" size="lg" onClick={() => {
                                                                    setSelectedStorage({
                                                                        "type": "cozy",
                                                                        "file": file,
                                                                        "url": data.urls[category.value][file.value][selectedTabs[category.value]?.[file.value] ?? badgeType[0]]
                                                                    });

                                                                    openedHandler.open();
                                                                }}>
                                                                    <IconCode />
                                                                </ActionIcon>
                                                            </Group>
                                                            {badgeType.map(type => (
                                                                <Tabs.Panel key={type} value={type} pt="md">
                                                                    <LazyLoad>
                                                                        <Anchor target="_blank" unstyled href={data.urls[category.value][file.value][type]} sx={{
                                                                            "width": "100%",
                                                                            "height": "100%"
                                                                        }}>
                                                                            <Image src={data.urls[category.value][file.value][type]} fit="contain" height={theme.spacing.xl * 5} />
                                                                        </Anchor>
                                                                    </LazyLoad>
                                                                </Tabs.Panel>
                                                            ))}
                                                        </Tabs>
                                                    </Stack>
                                                </DarkPaper>
                                            </LazyLoad>
                                        ))}
                                    </SimpleGrid>
                                </Accordion.Panel>
                            </Accordion.Item>
                        ))}
                    </Accordion>
                    <Text color="dimmed" align="center">All images displayed are <Anchor color="dimmed" underline target="_blank" href="https://github.com/intergrav/devins-badges/blob/HEAD/LICENSE">copyright (c) 2022 UltraStorm</Anchor>.</Text>
                </Stack>
            </StandardLayout>
            <Modal title="Copy Snippets" centered size="xl" opened={opened} onClose={() => {
                openedHandler.close();
            }}>
                <Tabs variant="pills" value={snippetTab} onTabChange={value => {
                    if (!value) {
                        return;
                    }

                    setSnippetTab(value);
                }}>
                    <Tabs.List grow>
                        <Tabs.Tab value="markdown" icon={<IconMarkdown />}>
                            Markdown
                        </Tabs.Tab>
                        <Tabs.Tab value="html" icon={<IconBrandHtml5 />}>
                            HTML
                        </Tabs.Tab>
                    </Tabs.List>
                    <Tabs.Panel value="markdown" pt="md">
                        <Stack>
                            <Prism language="markdown">
                                {`![${selectedStorage.file?.label}](${selectedStorage.url})`}
                            </Prism>
                            <Text size="sm" color="dimmed">Markdown does not support resizing images.</Text>
                        </Stack>
                    </Tabs.Panel>
                    <Tabs.Panel value="html" pt="md">
                        <Stack>
                            <Prism language="jsx">
                                {`<img alt="${selectedStorage.file?.label} badge" height="56" src="${selectedStorage.url}">`}
                            </Prism>
                            <Text size="sm" color="dimmed">Change the <Code>height</Code> property to change the width and height of the badge.</Text>
                        </Stack>
                    </Tabs.Panel>
                </Tabs>
            </Modal>
        </>
    );
}

