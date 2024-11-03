<?php

use App\controllers\FrontEndController;
use App\middlewares\StaticFilesMiddleware;
use DI\ContainerBuilder;
use Slim\Factory\AppFactory;


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

// Routes for frontend SPA
    $app->get('/{routes:.+}', [FrontEndController::class, 'all']);
    $app->get('/', [FrontEndController::class, 'index']);

    $app->run();

} catch (Exception $e) {
}