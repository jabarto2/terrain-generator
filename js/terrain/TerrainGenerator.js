var TerrainGenerator = function (widthPatches, depthPatches, patchWidth, patchDepth) {

    this.terrainPatches = new Array;
    this.widthPatches = widthPatches;
    this.depthPatches = depthPatches;

    // internal for now
    this.patchWidth = patchWidth;
    this.patchDepth = patchDepth;
    this.patchWidthSegments = 10;
    this.patchDepthSegments = 10;

    this.combinedTerrainMesh;

    var perlin = new ImprovedNoise();

    this.createTerrainPatches = function () {
        for (var i = 0; i < this.widthPatches; i++) {
            for (var j = 0; j < this.depthPatches; j++) {
                var patchX = i * this.patchWidth;
                var patchY = j * this.patchDepth;
                var patchZ = 0;
                var patch = new TerrainPatch(patchX, patchY, patchZ, this.patchWidth, this.patchDepth, this.patchWidthSegments, this.patchDepthSegments, perlin);
                this.terrainPatches.push(patch);
            }
        }
    }

    this.addTerrainToScene = function (scene) {
        for (terrain of this.terrainPatches) {
            scene.add(terrain.getMesh());
        }
    }

    this.createCombinedTerrain = function () {
        var patchGeometries = new Array;
        for (terrain of this.terrainPatches) {
            patchGeometries.push(terrain.getMesh().geometry);
        }

        var combinedTerrainGeometry = BufferGeometryUtils.mergeBufferGeometries(patchGeometries);

        material = new THREE.MeshStandardMaterial({ color: "green" });
        material.flatShading = true;
        // this.material.wireframe = true;

        this.combinedTerrainMesh = new THREE.Mesh(combinedTerrainGeometry, material);
    }

    this.addCombinedTerrainToScene = function (scene) {
        scene.add(this.combinedTerrainMesh);
    }

    this.createTerrainPatches();
    this.createCombinedTerrain();

};