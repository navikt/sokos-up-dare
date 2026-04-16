import { Box, LinkCard } from "@navikt/ds-react";

type MenyItemProps = {
	path: string;
	linkText: string;
	description: string;
	icon?: React.ReactNode;
};

export function MenyItem({ path, linkText, description, icon }: MenyItemProps) {
	return (
		<LinkCard>
			<Box
				asChild
				borderRadius="12"
				padding="space-8"
				style={{ backgroundColor: "var(--ax-bg-moderateA)" }}
			>
				<LinkCard.Icon>{icon}</LinkCard.Icon>
			</Box>
			<LinkCard.Title>
				<LinkCard.Anchor href={path}>{linkText}</LinkCard.Anchor>
			</LinkCard.Title>
			<LinkCard.Description>{description}</LinkCard.Description>
		</LinkCard>
	);
}
