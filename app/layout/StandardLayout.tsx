import { Stack } from "@mantine/core";
import { PropsWithChildren } from "react";

export function StandardLayout({ children }: PropsWithChildren) {
    return (
        <Stack spacing="xl" p="md">
            {children}
        </Stack>
    );
}
