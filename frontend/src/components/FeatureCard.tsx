import { Card, CardBody } from "@nextui-org/react";

type FeatureCardProps = {
    title: string;
    description: string;
};

export function FeatureCard({ title, description }: FeatureCardProps) {
    return (
        <Card>
            <CardBody>
                <h3 className="text-xl font-bold mb-2">{title}</h3>
                <p>{description}</p>
            </CardBody>
        </Card>
    );
}