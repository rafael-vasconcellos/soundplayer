/** @type {import('next').NextConfig} */
const nextConfig = {
    async headers() {
        return [
            {
                // Aplica esses cabeçalhos a todas as rotas
                source: '/(.*)', 
                headers: [
                    {
                        // Remova ou configure X-Frame-Options para permitir que a página seja embutida em qualquer domínio
                        key: 'X-Frame-Options',
                        value: 'ALLOWALL',
                    }, {
                        // Configure a política de segurança de conteúdo para permitir iframes de qualquer origem
                        key: 'Content-Security-Policy',
                        value: "frame-ancestors 'self' *", 
                    },
                ],
            },
        ];
    },
}

module.exports = nextConfig
