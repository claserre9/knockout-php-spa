<?php

namespace App\controllers\api;

use App\controllers\AbstractController;
use Psr\Http\Message\ResponseInterface;
use Slim\Psr7\Request;
use Slim\Psr7\Response;

class AuthController extends AbstractController
{

    public function register(Request $request, Response $response, array $args)
    {
        
    }

    public function login(Request $request, Response $response, array $args): ResponseInterface
    {

        $response->getBody()->write(json_encode(['message' => 'Login successful']));
        return $response->withHeader('Content-Type', 'application/json')->withStatus(200);
    }

    public function logout(Request $request, Response $response, array $args)
    {

    }


}