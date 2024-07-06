import { Request, Response, route } from './httpSupport'

async function POST(req: Request): Promise<Response> {
    return new Response(await req.json());
}

export default async function main(request: string) {
    return await route({ POST }, request)
}
