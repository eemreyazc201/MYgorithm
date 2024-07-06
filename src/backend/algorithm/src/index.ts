import { Request, Response, route } from './httpSupport'

async function POST(req: Request): Promise<Response> {
    let output = (await req.json()).posts;
    for (let i = 0; i < output.length-1; i++) {
        if (output[i].like.length < output[i+1].like.length) {
            let temp = output[i];
            output[i] = output[i+1];
            output[i+1] = temp;
        }
    }

    return new Response(JSON.stringify(output));
}

export default async function main(request: string) {
    return await route({ POST }, request)
}
