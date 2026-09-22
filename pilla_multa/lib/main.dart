import 'dart:convert';
import 'dart:io';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:http/http.dart' as http;
import 'package:flutter/foundation.dart' show kIsWeb;
void main() {
  runApp(const PillaMultaApp());
}

class PillaMultaApp extends StatelessWidget {
  const PillaMultaApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Pilla Multa',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.red),
        useMaterial3: true,
      ),
      home: const ValidationScreen(),
    );
  }
}

class ValidationScreen extends StatefulWidget {
  const ValidationScreen({super.key});

  @override
  State<ValidationScreen> createState() => _ValidationScreenState();
}

class _ValidationScreenState extends State<ValidationScreen> {
  XFile? _imageFile;
  final ImagePicker _picker = ImagePicker();
  bool _isLoading = false;
  Map<String, dynamic>? _aiResponse;
  String? _errorMessage;

  // Emulador de Android suele apuntar a 10.0.2.2 para localhost
  // iOS Simulator o Web apuntan a localhost o 127.0.0.1
  // Para dispositivo físico asegúrate de poner la IP local de tu máquina.
  String get apiUrl {
    const port = '3001';
    if (kIsWeb) {
      return 'http://localhost:$port/infractions/validate-sync';
    } else if (Platform.isAndroid) {
      return 'http://10.0.2.2:$port/infractions/validate-sync';
    } else {
      // iOS u otros
      return 'http://localhost:$port/infractions/validate-sync';
    }
  }

  Future<void> _pickImage(ImageSource source) async {
    try {
      final XFile? pickedFile = await _picker.pickImage(source: source);
      if (pickedFile != null) {
        setState(() {
          _imageFile = pickedFile;
          _aiResponse = null;
          _errorMessage = null;
        });
      }
    } catch (e) {
      setState(() {
        _errorMessage = "Error seleccionando imagen: $e";
      });
    }
  }

  Future<void> _validateInfraction() async {
    if (_imageFile == null) return;

    setState(() {
      _isLoading = true;
      _errorMessage = null;
      _aiResponse = null;
    });

    try {
      var request = http.MultipartRequest('POST', Uri.parse(apiUrl));
      
      if (kIsWeb) {
        request.files.add(
          http.MultipartFile.fromBytes(
            'file', 
            await _imageFile!.readAsBytes(), 
            filename: _imageFile!.name.isEmpty ? 'upload.jpg' : _imageFile!.name
          ),
        );
      } else {
        request.files.add(
          await http.MultipartFile.fromPath('file', _imageFile!.path),
        );
      }

      var response = await request.send();
      if (response.statusCode == 200 || response.statusCode == 201) {
        final responseData = await response.stream.bytesToString();
        setState(() {
          _aiResponse = jsonDecode(responseData);
        });
      } else {
        setState(() {
          _errorMessage = "Error del servidor: ${response.statusCode}";
        });
      }
    } catch (e) {
      setState(() {
        _errorMessage = "Error conectando con el backend: $e\n(Recuerda ajustar la IP si usas un dispositivo físico o emulador Android)";
      });
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
        title: const Text('Pilla Multa - Validación'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: <Widget>[
            if (_imageFile != null)
              ClipRRect(
                borderRadius: BorderRadius.circular(12),
                child: kIsWeb
                  ? Image.network(
                      _imageFile!.path,
                      height: 300,
                      fit: BoxFit.cover,
                    )
                  : Image.file(
                      File(_imageFile!.path),
                      height: 300,
                      fit: BoxFit.cover,
                    ),
              )
            else
              Container(
                height: 300,
                decoration: BoxDecoration(
                  color: Colors.grey.shade200,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: Colors.grey.shade400, width: 2, style: BorderStyle.solid),
                ),
                child: const Center(
                  child: Text('Ninguna foto seleccionada'),
                ),
              ),
            const SizedBox(height: 16),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                ElevatedButton.icon(
                  onPressed: () => _pickImage(ImageSource.camera),
                  icon: const Icon(Icons.camera_alt),
                  label: const Text('Cámara'),
                ),
                ElevatedButton.icon(
                  onPressed: () => _pickImage(ImageSource.gallery),
                  icon: const Icon(Icons.photo_library),
                  label: const Text('Galería'),
                ),
              ],
            ),
            const SizedBox(height: 24),
            ElevatedButton(
              onPressed: _imageFile == null || _isLoading ? null : _validateInfraction,
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.red.shade600,
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(vertical: 16),
              ),
              child: _isLoading 
                ? const SizedBox(
                    height: 20, 
                    width: 20, 
                    child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2)
                  )
                : const Text('Validar con IA', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            ),
            const SizedBox(height: 24),
            if (_errorMessage != null)
              Container(
                padding: const EdgeInsets.all(12),
                color: Colors.red.shade100,
                child: Text(_errorMessage!, style: TextStyle(color: Colors.red.shade900)),
              ),
            if (_aiResponse != null) ...[
              const Text('Resultados del Análisis:', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
              const SizedBox(height: 12),
              _buildResultRow('Infracción Detectada', _aiResponse!['isInfraction'] == true ? 'SÍ' : 'NO'),
              _buildResultRow('Placa Detectada', _aiResponse!['plateDetected'] ?? 'No detectada'),
              _buildResultRow('Tipo de Infracción', _aiResponse!['infractionType'] ?? 'N/A'),
              _buildResultRow('Confianza de la IA', '${((_aiResponse!['confidence'] ?? 0) * 100).toStringAsFixed(1)}%'),
              const SizedBox(height: 12),
              const Text('Explicación:', style: TextStyle(fontWeight: FontWeight.bold)),
              Text(_aiResponse!['explanation'] ?? 'Sin explicación', style: const TextStyle(fontSize: 16)),
              
              const SizedBox(height: 12),
              const Text('Respuesta JSON Raw (Para debug):', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Colors.grey)),
              Text(jsonEncode(_aiResponse), style: const TextStyle(fontSize: 10, color: Colors.grey)),
            ]
          ],
        ),
      ),
    );
  }

  Widget _buildResultRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8.0),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Expanded(flex: 2, child: Text(label, style: const TextStyle(fontWeight: FontWeight.w600))),
          Expanded(flex: 3, child: Text(value)),
        ],
      ),
    );
  }
}
