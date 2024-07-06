import { Request, Response, route } from './httpSupport'

async function POST(req: Request): Promise<Response> {
    let output = (await req.json()).body.posts;

    return new Response(output);
}

export default async function main(request: string) {
    return await route({ POST }, request)
}
