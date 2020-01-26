var TerrainPatch = function (x, y, z, width, depth, widthSegments, depthSegments, perlin) {

    this.x = x;
    this.y = y;
    this.z = z;
    this.width = width;
    this.depth = depth;
    this.widthSegments = widthSegments;
    this.depthSegments = depthSegments;

    // internals
    this.geometry;
    this.material;
    this.mesh;
    this.perlin = perlin

    this.generateHeight = function () {
        var size = this.widthSegments * this.depthSegments;
        var data = new Float32Array(size);
        var quality = 0.1 / ((this.widthSegments + this.depthSegments) / 2);
        var z = 1; // Math.random() * 100;
        var positionScale = (this.width + this.depth) / 2;
        var cycles = 4;
        for (var cycle = 0; cycle < cycles; cycle++) {
            var index = 0;
            // odd for loop order to ensure we loop through buffergeometry correctly
            for (var j = this.depthSegments - 1; j >= 0; j--) {
                for (var i = 0; i < this.widthSegments; i++) {
                    var x = i * this.width / (this.widthSegments - 1) + this.x;
                    var y = j * this.depth / (this.depthSegments - 1) + this.y;
                    x /= positionScale;
                    y /= positionScale;
                    var noiseValue = perlin.noise(x, y, z);
                    data[index++] += noiseValue * quality;
                }
            }
            quality *= 10;
        }
        return data;
    }

    this.generateGeometry = function () {
        var data = this.generateHeight(widthSegments, depthSegments);
        this.geometry = new THREE.PlaneBufferGeometry(this.width, this.depth, this.widthSegments - 1, this.depthSegments - 1);
        // this.geometry.rotateX(- Math.PI / 2);

        var vertices = this.geometry.attributes.position.array;


        var noiseScale = 10;

        for (var i = 0, j = 0, l = vertices.length; i < l; i++ , j += 3) {
            vertices[j] += this.x;
            vertices[j + 1] += this.y;
            vertices[j + 2] += data[i] * noiseScale + this.z;
        }
    }

    this.generateMaterial = function () {
        // var color = '#' + Math.floor(Math.random() * 16777215).toString(16);
        // var color = "green";
        // this.material = new THREE.MeshStandardMaterial({ color: color });
        // this.material.flatShading = true;
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