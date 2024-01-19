var Example = Example || {};

Example.cloth = function() {
    var Engine = Matter.Engine,
        Render = Matter.Render,
        Runner = Matter.Runner,
        World = Matter.World,
        Bodies = Matter.Bodies,
        MouseConstraint = Matter.MouseConstraint,
        Mouse = Matter.Mouse,
        Constraint = Matter.Constraint;

    // Create engine
    var engine = Engine.create(),
        world = engine.world;

    // Create renderer
    var render = Render.create({
        element: document.getElementById('exampleContainer'),
        engine: engine,
        options: {
            width: 800,
            height: 600,
            wireframes: false
        }
    });

    Render.run(render);

    // Create runner
    var runner = Runner.create();
    Runner.run(runner, engine);

    // Create cloth
    var group = Body.nextGroup(true);

    var cloth = Composites.softBody(200, 200, 20, 12, 5, 5, false, 8, function (x, y) {
        return Bodies.circle(x, y, 12, {
            collisionFilter: { group: group },
            friction: 0.0001,
            restitution: 0.5,
            density: 0.002
        });
    });

    for (var i = 0; i < cloth.bodies.length; i += 1) {
        cloth.bodies[i].isStatic = true;
    }

    World.add(world, [
        cloth,
        Bodies.circle(300, 500, 80, { isStatic: true }),
        Bodies.rectangle(500, 480, 80, 80, { isStatic: true })
    ]);

    // Add mouse control
    var mouse = Mouse.create(render.canvas),
        mouseConstraint = MouseConstraint.create(engine, {
            mouse: mouse,
            constraint: {
                stiffness: 0.98,
                render: {
                    visible: false
                }
            }
        });

    World.add(world, mouseConstraint);

    render.mouse = mouse;

    // Handle mouse clicks to apply an impulse to circles
    Events.on(mouseConstraint, 'mousedown', function (event) {
        var clickedBodies = Query.point(world.bodies, mouse.position);

        for (var i = 0; i < clickedBodies.length; i++) {
            var body = clickedBodies[i];
            if (body.circleRadius) { // Check if it's a circle
                Body.applyForce(body, body.position, { x: 0.02, y: -0.02 }); // Apply impulse
            }
        }
    });

    // Fit the render viewport to the scene
    Render.lookAt(render, {
        min: { x: 0, y: 0 },
        max: { x: 800, y: 600 }
    });

    return {
        engine: engine,
        runner: runner,
        render: render,
        canvas: render.canvas,
        stop: function () {
            Render.stop(render);
            Runner.stop(runner);
        }
    };
};

Example.cloth.title = 'Cloth';
Example.cloth.for = '>0.14.2';

if (typeof module !== 'undefined') {
    module.exports = Example.cloth;
}

// Run the example
Example.cloth();
