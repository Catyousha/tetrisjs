<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <link rel="stylesheet" href="index.css"></link>
    <title>Tetris-JS</title>
</head>
<body>

<header>
    <h1>Tetris-JS</h1>
    <h2>Score: <span id="score">0</span></h2>
    <button id="start-button">Start/Pause</button>
</header>

<main>
<div class="container">
    <div class="grid">
        <?php for($i = 0; $i<200; $i++){
            echo "<div></div>";
        }?>
        <?php for($i = 0; $i<10; $i++){
            echo "<div class=\"taken\"></div>";
        }?>
    </div>

    <div class="mini-grid">
        <?php for($i = 0; $i<16; $i++){
            echo "<div></div>";
        }?>
    </div>
</div>
</main>

<script src="app.js" charset="utf-8"></script>
</body>
</html>