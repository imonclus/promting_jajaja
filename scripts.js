
// Render functions for data.js
function renderDiccionario() {
    const container = document.getElementById('diccionario-container');
    if (!container || !kitData.diccionario) return;
    
    let html = '';
    kitData.diccionario.forEach(item => {
        html += `<div class="term-card">
            <h4>${item.title}</h4>
            <div class="definition">${item.definition}</div>`;
        if (item.example) {
            html += `<div class="example"><strong>Ejemplo:</strong> ${item.example}</div>`;
        }
        html += `</div>`;
    });
    container.innerHTML = html;
}

function renderPracticas() {
    const container = document.getElementById('practicas-container');
    if (!container || !kitData.practicas) return;
    
    let html = '';
    kitData.practicas.forEach(item => {
        html += `<div class="practice-card">
            <h4>${item.title}</h4>
            <p>${item.description}</p>
        </div>`;
    });
    container.innerHTML = html;
}

function renderRico() {
    const container = document.getElementById('rico-container');
    if (!container || !kitData.rico) return;
    
    let html = '';
    kitData.rico.forEach(item => {
        html += `<div class="term-card">
            <h4>${item.title}</h4>
            <div class="definition">${item.definition}</div>`;
        if (item.example) {
            html += `<div class="example"><strong>Ejemplos:</strong><br>${item.example}</div>`;
        }
        html += `</div>`;
    });
    container.innerHTML = html;
}

function renderGpts() {
    const container = document.getElementById('gpts-container');
    if (!container || !kitData.gpts) return;
    
    let html = '';
    kitData.gpts.forEach(item => {
        html += `<div class="term-card" style="border-left: 4px solid #10b981;">
            <h4>${item.name}</h4>
            <div class="category-tag" style="background: #10b98120;">${item.category}</div>
            <div class="definition">${item.description}</div>
            <div class="example"><strong>Ideal para:</strong> ${item.ideal_for}</div>
            <button class="btn" style="margin-top: 1rem; width: 100%;" onclick="window.open('${item.url}', '_blank')">Abrir en GPT Store</button>
        </div>`;
    });
    container.innerHTML = html;
}

// Initial render calls
renderDiccionario();
renderPracticas();
renderRico();
renderGpts();

        // Storage para prompts guardados
        const STORAGE_KEY = 'founderz_prompts_guardados';

        // Prompts profesionales predefinidos
        // promptsProfesionales se ha movido a data.js

        // Función para mostrar toast
        function showToast(message, duration = 3000) {
            const toast = document.getElementById('toast');
            toast.textContent = message;
            toast.classList.add('show');
            setTimeout(() => {
                toast.classList.remove('show');
            }, duration);
        }

        // Cambiar tabs
        function switchTab(tabName) {
            // Ocultar todos los tabs
            document.querySelectorAll('.tab-content').forEach(tab => {
                tab.classList.remove('active');
            });

            // Desactivar todos los botones
            document.querySelectorAll('.tab-navigation .tab-btn').forEach(btn => {
                btn.classList.remove('active');
            });

            // Activar tab y botón seleccionado
            document.getElementById('tab-' + tabName).classList.add('active');
            event.target.classList.add('active');

            // Si es la tab de prompts, renderizar
            if (tabName === 'prompts') {
                renderPrompts();
            }

            // Si es la tab de mis prompts, renderizar
            if (tabName === 'misprompts') {
                renderSavedPrompts();
            }
        }

        // Generar prompt RICO
        function generarPromptRICO() {
            const rol = document.getElementById('rico-rol').value;
            const instrucciones = document.getElementById('rico-instrucciones').value;
            const contexto = document.getElementById('rico-contexto').value;
            const output = document.getElementById('rico-output').value;

            if (!rol || !instrucciones || !contexto || !output) {
                showToast('⚠️ Por favor completa todos los campos del framework RICO');
                return;
            }

            const promptGenerado = `ROL: ${rol}

INSTRUCCIONES: ${instrucciones}

CONTEXTO: ${contexto}

OUTPUT: ${output}`;

            document.getElementById('rico-output-text').textContent = promptGenerado;
            document.getElementById('rico-resultado').style.display = 'block';

            showToast('✅ Prompt RICO generado correctamente');
        }

        // Copiar prompt RICO
        function copiarPromptRICO() {
            const text = document.getElementById('rico-output-text').textContent;
            navigator.clipboard.writeText(text).then(() => {
                showToast('📋 Prompt copiado al portapapeles');
            });
        }

        // Abrir prompt RICO en plataformas
        function abrirRICOEnChatGPT() {
            const text = document.getElementById('rico-output-text').textContent;
            abrirEnChatGPT(text);
        }

        function abrirRICOEnClaude() {
            const text = document.getElementById('rico-output-text').textContent;
            abrirEnClaude(text);
        }

        function abrirRICOEnCopilot() {
            const text = document.getElementById('rico-output-text').textContent;
            abrirEnCopilot(text);
        }

        // Filtrar prompts
        let currentFilter = 'all';
        function filterPrompts(categoria) {
            currentFilter = categoria;
            renderPrompts();
        }

        // Renderizar prompts
        function renderPrompts() {
            const container = document.getElementById('prompts-container');
            const filtered = currentFilter === 'all' 
                ? promptsProfesionales 
                : promptsProfesionales.filter(p => p.categoria === currentFilter);

            container.innerHTML = filtered.map(prompt => `
                <div class="prompt-card">
                    <h4>${prompt.titulo}</h4>
                    <span class="category-tag">${getCategoryName(prompt.categoria)}</span>
                    <div class="prompt-text">${prompt.prompt.replace(/\n/g, '<br>')}</div>
                    <div class="prompt-actions">
                        <button class="btn" onclick="copiarPrompt('${prompt.id}')">📋 Copiar</button>
                        <button class="btn btn-secondary" onclick="abrirEnChatGPT(\`${prompt.prompt.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`)">🤖 ChatGPT</button>
                        <button class="btn btn-secondary" onclick="abrirEnClaude(\`${prompt.prompt.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`)">💬 Claude</button>
                        <button class="btn btn-secondary" onclick="abrirEnCopilot(\`${prompt.prompt.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`)">🔷 Copilot</button>
                    </div>
                </div>
            `).join('');
        }

        function getCategoryName(cat) {
            const names = {
                'direccion': '📊 Dirección',
                'ventas': '💰 Ventas',
                'marketing': '📢 Marketing',
                'operaciones': '⚙️ Operaciones',
                'producto': '📦 Producto',
                'finanzas': '💼 Finanzas',
                'rrhh': '👥 RRHH',
                'otro': '🔧 Otro'
            };
            return names[cat] || cat;
        }

        // Versión sin emojis para Excel
        function getCategoryNameClean(cat) {
            const names = {
                'direccion': 'Dirección',
                'ventas': 'Ventas',
                'marketing': 'Marketing',
                'operaciones': 'Operaciones',
                'producto': 'Producto',
                'finanzas': 'Finanzas',
                'rrhh': 'RRHH',
                'otro': 'Otro'
            };
            return names[cat] || cat;
        }

        function copiarPrompt(id) {
            const prompt = promptsProfesionales.find(p => p.id == id);
            if (prompt) {
                navigator.clipboard.writeText(prompt.prompt).then(() => {
                    showToast('📋 Prompt copiado al portapapeles');
                });
            }
        }

        // Copiar ejemplos RICO
        function copiarEjemploRICO(elementId) {
            const element = document.getElementById(elementId);
            if (element) {
                const text = element.textContent;
                navigator.clipboard.writeText(text).then(() => {
                    showToast('📋 Ejemplo RICO copiado al portapapeles');
                }).catch(() => {
                    showToast('⚠️ Error al copiar. Inténtalo manualmente.');
                });
            }
        }

        // Sistema de prompts guardados
        function guardarNuevoPrompt() {
            const title = document.getElementById('new-prompt-title').value;
            const category = document.getElementById('new-prompt-category').value;
            const text = document.getElementById('new-prompt-text').value;

            if (!title || !text) {
                showToast('⚠️ Por favor completa título y prompt');
                return;
            }

            // Obtener prompts guardados
            let saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');

            // Agregar nuevo prompt
            const newPrompt = {
                id: Date.now(),
                title,
                category,
                text,
                created: new Date().toISOString()
            };

            saved.push(newPrompt);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));

            // Limpiar form
            document.getElementById('new-prompt-title').value = '';
            document.getElementById('new-prompt-text').value = '';

            showToast('✅ Prompt guardado correctamente');
            renderSavedPrompts();
        }

        function renderSavedPrompts() {
            const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
            const container = document.getElementById('saved-prompts-list');

            if (saved.length === 0) {
                container.innerHTML = `
                    <div class="term-card" style="text-align: center; padding: 3rem;">
                        <h4 style="color: #999;">📂 No tienes prompts guardados aún</h4>
                        <p style="color: #666; margin-top: 1rem;">Crea tu primer prompt usando el formulario arriba</p>
                    </div>
                `;
                return;
            }

            container.innerHTML = `
                <table class="saved-prompts-table">
                    <thead>
                        <tr>
                            <th>Título</th>
                            <th>Categoría</th>
                            <th>Fecha</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${saved.reverse().map(prompt => `
                            <tr>
                                <td><strong>${prompt.title}</strong></td>
                                <td>${getCategoryName(prompt.category)}</td>
                                <td>${new Date(prompt.created).toLocaleDateString('es-ES')}</td>
                                <td>
                                    <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                                        <button class="btn" style="padding: 0.5rem 1rem;" onclick="verPrompt(${prompt.id})">👁️ Ver</button>
                                        <button class="btn" style="padding: 0.5rem 1rem;" onclick="copiarPromptGuardado(${prompt.id})">📋 Copiar</button>
                                        <button class="btn btn-secondary" style="padding: 0.5rem 1rem;" onclick="abrirPromptGuardadoEnChatGPT(${prompt.id})">🤖 GPT</button>
                                        <button class="btn btn-secondary" style="padding: 0.5rem 1rem;" onclick="abrirPromptGuardadoEnClaude(${prompt.id})">💬 Claude</button>
                                        <button class="btn btn-secondary" style="padding: 0.5rem 1rem;" onclick="abrirPromptGuardadoEnCopilot(${prompt.id})">🔷 Copilot</button>
                                        <button class="btn btn-secondary" style="padding: 0.5rem 1rem; background: #f59e0b;" onclick="editarPrompt(${prompt.id})">✏️ Editar</button>
                                        <button class="btn btn-secondary" style="padding: 0.5rem 1rem; background: #dc2626;" onclick="eliminarPrompt(${prompt.id})">🗑️</button>
                                    </div>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;
        }

        function verPrompt(id) {
            const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
            const prompt = saved.find(p => p.id === id);
            if (prompt) {
                alert(`Título: ${prompt.title}\n\nPrompt:\n${prompt.text}`);
            }
        }

        function copiarPromptGuardado(id) {
            const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
            const prompt = saved.find(p => p.id === id);
            if (prompt) {
                navigator.clipboard.writeText(prompt.text).then(() => {
                    showToast('📋 Prompt copiado al portapapeles');
                });
            }
        }

        function eliminarPrompt(id) {
            if (confirm('¿Estás seguro de eliminar este prompt?')) {
                let saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
                saved = saved.filter(p => p.id !== id);
                localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
                showToast('🗑️ Prompt eliminado');
                renderSavedPrompts();
            }
        }

        function editarPrompt(id) {
            const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
            const prompt = saved.find(p => p.id === id);
            if (prompt) {
                document.getElementById('edit-prompt-id').value = id;
                document.getElementById('edit-prompt-title').value = prompt.title;
                document.getElementById('edit-prompt-category').value = prompt.category;
                document.getElementById('edit-prompt-text').value = prompt.text;
                document.getElementById('editModal').style.display = 'flex';
            }
        }

        function guardarEdicion() {
            const id = parseInt(document.getElementById('edit-prompt-id').value);
            const title = document.getElementById('edit-prompt-title').value;
            const category = document.getElementById('edit-prompt-category').value;
            const text = document.getElementById('edit-prompt-text').value;

            if (!title || !text) {
                showToast('⚠️ Por favor completa título y prompt');
                return;
            }

            let saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
            const index = saved.findIndex(p => p.id === id);
            if (index !== -1) {
                saved[index].title = title;
                saved[index].category = category;
                saved[index].text = text;
                localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
                showToast('✅ Prompt actualizado correctamente');
                renderSavedPrompts();
                cerrarModalEditar();
            }
        }

        function cerrarModalEditar() {
            document.getElementById('editModal').style.display = 'none';
        }

        // ========== FUNCIONES DE DESCARGA ==========

        function descargarPromptsTXT() {
            const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
            
            if (saved.length === 0) {
                showToast('⚠️ No tienes prompts guardados para descargar');
                return;
            }

            let contenido = '='.repeat(80) + '\n';
            contenido += 'MIS PROMPTS PROFESIONALES - FOUNDERZ\n';
            contenido += 'Generado: ' + new Date().toLocaleString('es-ES') + '\n';
            contenido += '='.repeat(80) + '\n\n';

            saved.forEach((prompt, index) => {
                contenido += `${index + 1}. ${prompt.title}\n`;
                contenido += '-'.repeat(80) + '\n';
                contenido += `Categoría: ${getCategoryName(prompt.category)}\n`;
                contenido += `Fecha: ${new Date(prompt.created).toLocaleDateString('es-ES')}\n\n`;
                contenido += `PROMPT:\n${prompt.text}\n\n`;
                contenido += '='.repeat(80) + '\n\n';
            });

            const blob = new Blob([contenido], { type: 'text/plain;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `mis-prompts-founderz-${new Date().toISOString().split('T')[0]}.txt`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            showToast('📄 Archivo TXT descargado correctamente');
        }

        function descargarPromptsExcel() {
            const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
            
            if (saved.length === 0) {
                showToast('⚠️ No tienes prompts guardados para descargar');
                return;
            }

            // Crear CSV (compatible con Excel) con UTF-8 BOM
            let csv = '\uFEFF'; // BOM para UTF-8
            csv += 'Titulo;Categoria;Fecha;Prompt\n'; // Usar ; como delimitador

            saved.forEach(prompt => {
                // Limpiar y escapar valores
                const titulo = prompt.title.replace(/"/g, '""').replace(/[\r\n]/g, ' ');
                const categoria = getCategoryNameClean(prompt.category);
                const fecha = new Date(prompt.created).toLocaleDateString('es-ES');
                const texto = prompt.text.replace(/"/g, '""').replace(/[\r\n]/g, ' ');
                
                csv += `"${titulo}";"${categoria}";"${fecha}";"${texto}"\n`;
            });

            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `mis-prompts-founderz-${new Date().toISOString().split('T')[0]}.csv`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            showToast('📊 Archivo Excel descargado correctamente');
        }

        // ========== FUNCIONES ABRIR EN PLATAFORMAS ==========

        function abrirEnChatGPT(promptText) {
            // Copiar al clipboard
            navigator.clipboard.writeText(promptText).then(() => {
                showToast('📋 Prompt copiado. Abriendo ChatGPT... ¡Pega con Ctrl+V!');
                // Abrir ChatGPT en nueva pestaña
                setTimeout(() => {
                    window.open('https://chatgpt.com/', '_blank');
                }, 500);
            }).catch(() => {
                showToast('⚠️ Error al copiar. Inténtalo manualmente.');
            });
        }

        function abrirEnClaude(promptText) {
            // Copiar al clipboard
            navigator.clipboard.writeText(promptText).then(() => {
                showToast('📋 Prompt copiado. Abriendo Claude... ¡Pega con Ctrl+V!');
                // Abrir Claude en nueva pestaña
                setTimeout(() => {
                    window.open('https://claude.ai/new', '_blank');
                }, 500);
            }).catch(() => {
                showToast('⚠️ Error al copiar. Inténtalo manualmente.');
            });
        }

        function abrirEnCopilot(promptText) {
            // Copiar al clipboard
            navigator.clipboard.writeText(promptText).then(() => {
                showToast('📋 Prompt copiado. Abriendo Copilot... ¡Pega con Ctrl+V!');
                // Abrir Copilot en nueva pestaña
                setTimeout(() => {
                    window.open('https://copilot.microsoft.com/', '_blank');
                }, 500);
            }).catch(() => {
                showToast('⚠️ Error al copiar. Inténtalo manualmente.');
            });
        }

        // Versiones para prompts guardados
        function abrirPromptGuardadoEnChatGPT(id) {
            const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
            const prompt = saved.find(p => p.id === id);
            if (prompt) {
                abrirEnChatGPT(prompt.text);
            }
        }

        function abrirPromptGuardadoEnClaude(id) {
            const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
            const prompt = saved.find(p => p.id === id);
            if (prompt) {
                abrirEnClaude(prompt.text);
            }
        }

        function abrirPromptGuardadoEnCopilot(id) {
            const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
            const prompt = saved.find(p => p.id === id);
            if (prompt) {
                abrirEnCopilot(prompt.text);
            }
        }

        // Inicialización
        document.addEventListener('DOMContentLoaded', function() {
            renderPrompts();
            renderSavedPrompts();
            
            // Scroll to Top functionality
            const scrollToTopBtn = document.getElementById('scrollToTop');
            
            if (scrollToTopBtn) {
                window.addEventListener('scroll', function() {
                    if (window.pageYOffset > 300) {
                        scrollToTopBtn.classList.add('visible');
                    } else {
                        scrollToTopBtn.classList.remove('visible');
                    }
                });

                scrollToTopBtn.addEventListener('click', function() {
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                });
            }
        });
