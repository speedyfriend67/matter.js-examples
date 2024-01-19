var Example = Example || {};

Example.statsAndPerformance = function() {
    var Engine = Matter.Engine,
        Render = Matter.Render,
        World = Matter.World,
        Bodies = Matter.Bodies,
        Events = Matter.Events;

    var engine = Engine.create(),
        world = engine.world;

    var render = Render.create({
        element: document.getElementById('exampleContainer'),
        engine: engine
    });

    var runner = Matter.Runner.create();

    var boxA = Bodies.rectangle(400, 200, 80, 80);
    var boxB = Bodies.rectangle(450, 50, 80, 80);
    var ground = Bodies.rectangle(400, 610, 810, 60, { isStatic: true });

    World.add(world, [boxA, boxB, ground]);

    Engine.run(engine);
    Render.run(render);
    Matter.Runner.run(runner, engine);

    // Create a Stats.js instance for monitoring performance
    var stats = new Stats();
    stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
    document.body.appendChild(stats.dom);

    // Update stats on each frame
    Events.on(engine, 'beforeUpdate', function() {
        stats.begin();
    });

    Events.on(engine, 'afterUpdate', function() {
        stats.end();
    });
};
