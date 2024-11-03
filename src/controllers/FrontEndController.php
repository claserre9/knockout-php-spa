<?php
namespace App\controllers;

use Slim\Psr7\Factory\StreamFactory;
use Slim\Psr7\Request;
use Slim\Psr7\Response;

class FrontEndController
{
    private function serveHtmlFile(Response $response, string $filePath): Response
    {
        if (file_exists($filePath)) {
            $streamFactory = new StreamFactory();
            $stream = $streamFactory->createStreamFromFile($filePath);
            return $response
                ->withHeader('Content-Type', 'text/html')
                ->withBody($stream);
        }
        return $response->withStatus(404, 'Not Found');
    }

    public function all(Request $request, Response $response, array $args): Response
    {
        $filePath = __DIR__ . '/../../public/index.html';
        return $this->serveHtmlFile($response, $filePath);
    }

    public function index(Request $request, Response $response, array $args): Response
    {
        $filePath = __DIR__ . '/../../public/index.html';
        return $this->serveHtmlFile($response, $filePath);
    }
}