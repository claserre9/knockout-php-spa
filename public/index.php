<?php

use App\controllers\api\AuthController;
use App\controllers\FrontEndController;
use App\middlewares\StaticFilesMiddleware;
use DI\ContainerBuilder;
use Slim\Factory\AppFactory;
use Slim\Routing\RouteCollectorProxy;


ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);

require_once __DIR__ . "/../config/env.php";
require_once __DIR__ . "/../vendor/autoload.php";

$isProduction = isset($_ENV['APP_ENV']) && $_ENV['APP_ENV'] == 'production';

try {
    $builder = new ContainerBuilder();
    $builder->addDefinitions(require __DIR__ . "/../config/container.php");
    $container = $builder->build();
    $app = AppFactory::createFromContainer($container);

    // Middleware to serve static files
    $app->add(new StaticFilesMiddleware());

    $app->addErrorMiddleware(!$isProduction, !$isProduction, !$isProduction)
        ->getDefaultErrorHandler()
        ->forceContentType("application/json");

    //api
    $app->group('/api', function (RouteCollectorProxy $group){
        $group->group('/v1', function (RouteCollectorProxy $group){
            //Authentication
            $group->group('/auth', function (RouteCollectorProxy $group){
                $group->get('/login', [AuthController::class, 'login']);
                $group->post('/register', [AuthController::class, 'register']);
                $group->post('/logout', [AuthController::class, 'logout']);
                $group->post('/refresh', [AuthController::class, 'refresh']);
                $group->post('/me', [AuthController::class, 'me']);
                $group->post('/forgot-password', [AuthController::class, 'forgotPassword']);
                $group->post('/reset-password', [AuthController::class, 'resetPassword']);
                $group->post('/verify-email', [AuthController::class, 'verifyEmail']);
                $group->post('/resend-verify-email', [AuthController::class, 'resendVerifyEmail']);
            });
        });
    });

    // Routes for frontend SPA
    $app->get('/{routes:.+}', [FrontEndController::class, 'all']);
    $app->get('/', [FrontEndController::class, 'index']);

    $app->run();

} catch (Exception $e) {
}