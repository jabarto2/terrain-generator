var TerrainPatch = function (x, y, z, width, depth, widthSegments, depthSegments, perlin) {

    this.x = x;
    this.y = y;
    this.z = z;
    this.width = width;
    this.depth = depth;
    this.widthSegments = widthSegments;
    this.depthSegments = depthSegments;

    this.maxHeight = Math.floor((this.width + this.depth) / 2) / 1;
    this.waterLevel = - (1 / 3) * this.maxHeight;

    // internals
    this.geometry;
    this.material;
    this.mesh;
    this.perlin = perlin;

    this.generateHeight = function () {
        var size = this.widthSegments * this.depthSegments;
        var data = new Float32Array(size);
        var cycles = 4;

        for (var cycle = 0; cycle < cycles; cycle++) {
            var index = 0;

            var noiseScale = this.maxHeight * ((cycle + 1) / cycles);
            var positionScale = 3 * (this.width + this.depth) / 2 * ((cycle + 1) / cycles);

            // odd for loop order to ensure we loop through buffergeometry correctly
            for (var j = this.depthSegments - 1; j >= 0; j--) {
                for (var i = 0; i < this.widthSegments; i++) {

                    var x = i * this.width / (this.widthSegments - 1) + this.x;
                    var y = j * this.depth / (this.depthSegments - 1) + this.y;
                    x /= positionScale;
                    y /= positionScale;
                    var noiseValue = perlin.perlin2(x, y);
                    data[index++] += noiseValue * noiseScale;

                    // console.log("(x,y): " + x + "," + y + "");
                    // console.log(noiseValue * noiseScale);
                    // console.log();
                }
            }
            console.log("noiseScale: " + noiseScale);
            console.log("positionScale: " + positionScale);
        }
        return data;
    }

    this.generateGeometry = function () {
        var data = this.generateHeight(widthSegments, depthSegments);
        this.geometry = new THREE.PlaneBufferGeometry(this.width, this.depth, this.widthSegments - 1, this.depthSegments - 1);
        // this.geometry.rotateX(- Math.PI / 2);

        var vertices = this.geometry.attributes.position.array;

        for (var i = 0, j = 0, l = vertices.length; i < l; i++ , j += 3) {
            vertices[j] += this.x;
            vertices[j + 1] += this.y;
            vertices[j + 2] += data[i] + this.z;
            if (vertices[j + 2] < this.waterLevel) {
                vertices[j + 2] = this.waterLevel;
            }

        }
        this.addColorToTerrain();
    }

    this.addColorToTerrain = function () {
        const waterColor = { r: 68 / 255, g: 204 / 255, b: 255 / 255 };
        const terrainColor1 = { r: 238 / 255, g: 204 / 255, b: 68 / 255 };
        const terrainColor2 = 0x228800;
        const terrainColor3 = 0x116600;
        const terrainColor4 = 0x113300;

        var verticesLength = this.geometry.attributes.position.array.length;

        var colors = [];

        for (var i = 0; i < verticesLength; i += 3) {
            var z = this.geometry.attributes.position.array[i + 2];
            if (z <= this.waterLevel) {
                colors.push(waterColor.r, waterColor.g, waterColor.b);
            } else {
                colors.push(terrainColor1.r, terrainColor1.g, terrainColor1.b);
            }
        }

        this.geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
        console.log(this.geometry);

        this.geometry.colorsNeedUpdate = true;
    }

    this.generateMaterial = function () {
        var color = '#' + Math.floor(Math.random() * 16777215).toString(16);
        // var color = "green";
        this.material = new THREE.MeshStandardMaterial();
        this.material.vertexColors = THREE.VertexColors;
        this.material.flatShading = true;
        // this.material.wireframe = true;

    }

    this.generateMesh = function () {
        this.generateGeometry();
        this.generateMaterial();
        this.mesh = new THREE.Mesh(this.geometry, this.material);
    }


    this.getMesh = function () {
        return this.mesh;
    }

    this.generateMesh();

};