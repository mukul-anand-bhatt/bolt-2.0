import {
    CloudFrontClient,
    CreateInvalidationCommand,
} from "@aws-sdk/client-cloudfront";

const cf = new CloudFrontClient({
    region: "us-east-1", // CloudFront is global
});

export async function invalidateProject(projectId: string) {
    await cf.send(
        new CreateInvalidationCommand({
            DistributionId: process.env.CLOUDFRONT_DISTRIBUTION_ID!,
            InvalidationBatch: {
                CallerReference: Date.now().toString(),
                Paths: {
                    Quantity: 1,
                    Items: [`/projects/${projectId}/*`],
                },
            },
        })
    );
}
