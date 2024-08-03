import { Card, CardBody, CardHeader } from "@nextui-org/react";
import { PageHeader } from "../PageHeader";


export function WelcomeCard() {
    return (
        <Card>
            <CardHeader>
                <PageHeader title="Welcome to the Course Rules Management System (Demo)" />
            </CardHeader>
            <CardBody>
                <p className="text-lg">
                    This centralized platform allows you to manage and update course rules efficiently. Use the navigation menu
                    to access different features.
                </p>
            </CardBody>
        </Card>
    );
}